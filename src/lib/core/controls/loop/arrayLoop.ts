import type { Any, Context, ContextData } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { compileObject, type LoopParts } from './utils.js';
import { compile } from '@/lib/core/utils/compile/index.js';

/**
 * Handles iteration over arrays.
 */
export function* handleArrayIteration(parts: LoopParts, context: Context, template: Any): Generator<LoopItem> {
    // Get the array from context
    const items = context.get(parts.iterablePath);

    // Check if the array exists
    if (items === undefined) {
        throw new Error(`Iterable '${parts.iterablePath}' not found in context`);
    }

    // Check if it's actually an array
    if (!Array.isArray(items)) {
        throw new Error(`'${parts.iterablePath}' is not an array`);
    }

    // Iterate over the array
    let index = 0;
    for (const item of items) {
        // Create loop-specific variables to be added to the context
        const loopVariables = {
            [parts.itemVar]: item,
            ...(parts.indexVar ? { [parts.indexVar]: index } : {}),
        };

        // Create a new context that inherits from the parent context
        // but overrides with loop-specific variables
        const loopContext = context.cloneWith(loopVariables);

        // Handle different template types
        yield* processArrayTemplateItem(template, loopContext.data, loopContext.data);

        index++;
    }
}

/**
 * Helper function to process templates for array iterations.
 */
function* processArrayTemplateItem(template: Any, loopContext: ContextData, contextForCompilation: ContextData): Generator<LoopItem> {
    if (typeof template === 'object') {
        if (Array.isArray(template)) {
            for (const templateItem of template) {
                const compiledTemplate = compileObject(templateItem, contextForCompilation);
                yield { template: compiledTemplate, context: loopContext };
            }
        } else if ('text' in template) {
            // If it's a text template with potentially other properties, compile everything
            const compiledTemplate: Record<string, unknown> = {};
            
            // Compile all properties in the template object
            for (const [key, value] of Object.entries(template)) {
                if (key === 'text' && typeof value === 'string') {
                    compiledTemplate[key] = compile(value, contextForCompilation);
                } else {
                    // For other properties like conditionals, recursively compile any nested string values
                    compiledTemplate[key] = compileNestedValues(value, contextForCompilation);
                }
            }
            
            yield { template: compiledTemplate, context: loopContext };
        } else {
            const compiledTemplate = compileObject(template, contextForCompilation);
            yield { template: compiledTemplate, context: loopContext };
        }
    } else if (typeof template === 'string') {
        const compiledText = compile(template, contextForCompilation);
        yield { template: { text: compiledText }, context: loopContext };
    } else {
        yield { template, context: loopContext };
    }
}

/**
 * Recursively compiles nested string values in objects.
 */
function compileNestedValues(value: unknown, context: Any): unknown {
    if (typeof value === 'string') {
        return compile(value, context);
    } else if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return value.map(item => compileNestedValues(item, context));
        } else {
            const result: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(value)) {
                result[k] = compileNestedValues(v, context);
            }
            return result;
        }
    }
    return value;
}
