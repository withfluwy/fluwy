import type { Any, Context, ContextData } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { compileObject } from './utils.js';
import { compile } from '@/lib/core/utils/compile/index.js';

/**
 * Processes a times loop expression and generates values.
 */
export function* handleTimesLoop(expression: string, context: Context, template: Any): Generator<LoopItem> {
    const parts = expression.split(/\s+/);

    // Validate times loop syntax
    if (parts.length < 3 || parts[1] !== 'times') {
        throw new Error('Invalid times loop syntax');
    }

    // Parse the number of iterations
    let count: number;
    const countValue = parts[0];

    // Check if it's a context variable
    const contextValue = context.get(countValue);
    if (contextValue !== undefined) {
        if (typeof contextValue !== 'number') {
            throw new Error('Times loop requires an integer value');
        }
        if (!Number.isInteger(contextValue)) {
            throw new Error('Times loop requires an integer value');
        }
        count = contextValue;
    } else {
        count = parseInt(countValue, 10);
        if (isNaN(count) || !Number.isInteger(count)) {
            throw new Error('Times loop requires an integer value');
        }
    }

    // Handle 'with' syntax: '3 times with n do'
    if (parts.length === 5 && parts[2] === 'with' && parts[4] === 'do') {
        const varName = parts[3];

        // Iterate with a variable
        for (let i = 1; i <= count; i++) {
            const loopContext = { ...context.data, [varName]: i } as ContextData;
            yield* processTemplateWithContext(template, loopContext, context.data);
        }
    } else if (parts.length === 3 && parts[2] === 'do') {
        // Basic times loop: '3 times do'
        for (let i = 0; i < count; i++) {
            // Empty context for simple times loop without variable
            const loopContext = {} as ContextData;
            yield* processTemplateWithContext(template, loopContext, context.data);
        }
    } else {
        throw new Error('Invalid times loop syntax');
    }
}

/**
 * Helper function to process templates with the given context for times loops.
 */
function* processTemplateWithContext(template: Any, loopContext: ContextData, parentContext: Any): Generator<LoopItem> {
    // Create merged context
    const mergedContext = { ...parentContext, ...loopContext };

    if (typeof template === 'object') {
        if (Array.isArray(template)) {
            for (const templateItem of template) {
                const compiledTemplate = compileObject(templateItem, mergedContext);
                yield { template: compiledTemplate, context: loopContext };
            }
        } else if ('text' in template) {
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
