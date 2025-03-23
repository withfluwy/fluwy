import type { Any, Context } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { compileObject, type LoopParts } from './utils.js';
import { compile } from '@/lib/core/utils/compile/index.js';

/**
 * Handles iteration over object properties.
 */
export function* handleObjectPropIteration(parts: LoopParts, context: Context, template: Any): Generator<LoopItem> {
    const obj = context.get(parts.iterablePath);

    // Validate the object
    if (obj === undefined) {
        throw new Error(`Object '${parts.iterablePath}' not found in context`);
    }

    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        throw new Error(`'${parts.iterablePath}' is not an object`);
    }

    // Iterate over object properties
    let index = 0;
    for (const key of Object.keys(obj)) {
        // Create loop-specific variables to be added to the context
        const loopVariables = {
            [parts.itemVar]: key,
            ...(parts.indexVar ? { [parts.indexVar]: index } : {}),
        };

        // Create a new context that inherits from the parent context
        // but overrides with loop-specific variables
        const loopContext = context.cloneWith(loopVariables);

        // Use parent context data for resolving variables not in the loop context

        // Handle the special case of ${object[key]} pattern
        if (typeof template === 'object' && 'text' in template) {
            let text = template.text;

            // Replace ${object[key]} with the actual value
            const objKeyPattern = new RegExp(`\\$\\{${parts.iterablePath}\\[${parts.itemVar}\\]\\}`, 'g');
            text = text.replace(objKeyPattern, String(obj[key]));

            // Now compile the rest of the template with the merged context
            const compiledText = compile(text, loopContext.data);
            yield { template: { text: compiledText }, context: loopContext.data };
        } else {
            const compiledTemplate = compileObject(template, loopContext.data);
            yield { template: compiledTemplate, context: loopContext.data };
        }

        index++;
    }
}
