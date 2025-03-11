import type { Any, Context } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { compileObject, getVariableFromContext } from './utils.js';
import { compile } from '@/lib/core/utils/compile/index.js';

/**
 * Defines the parameters for a range-based loop.
 */
export interface RangeResult {
    start: number;
    end: number;
    isExclusive: boolean;
    itemName?: string;
}

/**
 * Generates range values from start to end.
 */
export function* generateRangeValues(range: RangeResult, template: Any, context: Context): Generator<LoopItem> {
    const endValue = range.isExclusive ? range.end : range.end + 1;
    for (let i = range.start; i < endValue; i++) {
        const itemName = range.itemName || 'n';
        const loopVariables = { [itemName]: i };
        const loopContext = context.cloneWith(loopVariables);

        if (typeof template === 'object') {
            if (Array.isArray(template)) {
                for (const templateItem of template) {
                    const compiledTemplate = compileObject(templateItem, loopContext.data);
                    yield { template: compiledTemplate, context: loopContext.data };
                }
            } else if ('text' in template) {
                const compiledText = compile(template.text, loopContext.data);
                yield { template: { text: compiledText }, context: loopContext.data };
            } else {
                const compiledTemplate = compileObject(template, loopContext.data);
                yield { template: compiledTemplate, context: loopContext.data };
            }
        } else if (typeof template === 'string') {
            const compiledText = compile(template, loopContext.data);
            yield { template: { text: compiledText }, context: loopContext.data };
        } else {
            yield { template, context: loopContext.data };
        }
    }
}

/**
 * Extract and validate range values from a range expression.
 */
export function extractRangeValues(
    startExpr: string,
    endExpr: string,
    context: Context
): { startNum: number; endNum: number } {
    // Get the range values
    const startValue = getVariableFromContext(startExpr, context);
    const endValue = getVariableFromContext(endExpr, context);

    // Convert to numbers
    const startNum = Number(startValue);
    const endNum = Number(endValue);

    // Validate
    if (isNaN(startNum) || isNaN(endNum)) {
        throw new Error('Range values must be integers');
    }

    if (!Number.isInteger(startNum) || !Number.isInteger(endNum)) {
        throw new Error('Range values must be integers');
    }

    return { startNum, endNum };
}

/**
 * Processes a range loop expression and generates values.
 */
export function processRangeLoop(expression: string, template: Any, context: Context): Generator<LoopItem> {
    const parts = expression.split(/\s+/);

    // Check if it's a range expression with .. or ...
    const rangeMatch = parts[3].match(/^(.+?)(\.{2,3})(.+?)$/);
    if (!rangeMatch) {
        throw new Error('Invalid range syntax');
    }

    const [, startExpr, dots, endExpr] = rangeMatch;
    const isExclusive = dots === '...';

    // Extract and validate range values
    const { startNum, endNum } = extractRangeValues(startExpr, endExpr, context);

    // Generate values
    const itemName = parts[1];
    return generateRangeValues(
        {
            start: startNum,
            end: endNum,
            isExclusive,
            itemName,
        },
        template,
        context
    );
}
