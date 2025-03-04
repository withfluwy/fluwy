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
        // Create a context for this iteration
        const loopContext = {
            ...context.data,
            [parts.itemVar]: item,
            ...(parts.indexVar ? { [parts.indexVar]: index } : {}),
        } as ContextData;

        // Create a new context by merging the parent context with loop variables
        // This will override the parent context variables with the same names
        const mergedContext = { ...context.data, ...loopContext };

        // Handle different template types
        yield* processArrayTemplateItem(template, loopContext, mergedContext);

        index++;
    }
}

/**
 * Helper function to process templates for array iterations.
 */
function* processArrayTemplateItem(template: Any, loopContext: ContextData, mergedContext: Any): Generator<LoopItem> {
    if (typeof template === 'object') {
        if (Array.isArray(template)) {
            for (const templateItem of template) {
                const compiledTemplate = compileObject(templateItem, mergedContext);
                yield { template: compiledTemplate, context: loopContext };
            }
        } else if ('text' in template) {
            // If it's a text template, compile it directly
            const compiledText = compile(template.text, mergedContext);
            yield { template: { text: compiledText }, context: loopContext };
        } else {
            const compiledTemplate = compileObject(template, mergedContext);
            yield { template: compiledTemplate, context: loopContext };
        }
    } else if (typeof template === 'string') {
        const compiledText = compile(template, mergedContext);
        yield { template: { text: compiledText }, context: loopContext };
    } else {
        yield { template, context: loopContext };
    }
}
