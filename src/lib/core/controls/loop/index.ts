import type { Context } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { handleTimesLoop } from './timesLoop.js';
import { processRangeLoop, extractRangeValues, generateRangeValues } from './rangeLoop.js';
import { handleArrayIteration } from './arrayLoop.js';
import { handleObjectPropIteration } from './objectLoop.js';
import { checkLoopExpression, getLoopType, LoopType } from './validators.js';
import { parseLoopParts, type ForLoop } from './utils.js';

export const loop_expression = {
    /**
     * Checks if the provided expression is a valid loop expression.
     */
    check(expression: string): boolean {
        return checkLoopExpression(expression);
    },

    /**
     * Evaluates a loop expression and returns a generator that yields LoopItem objects.
     * Each LoopItem contains the compiled template and the context data for that iteration.
     */
    evaluate(loop: ForLoop, context: Context): Generator<LoopItem> {
        const [expression, template] = Object.entries(loop)[0];

        const parts = expression.split(/\s+/);

        // Special case for range expressions with either 'in' or 'of'
        if (
            (parts[0] === 'for' || parts[0] === 'each') &&
            parts.length === 4 &&
            (parts[2] === 'in' || parts[2] === 'of') &&
            parts[3].includes('..')
        ) {
            const rangeMatch = parts[3].match(/^(.+?)(\.{2,3})(.+?)$/);
            if (rangeMatch) {
                const [, startExpr, dots, endExpr] = rangeMatch;
                const isExclusive = dots === '...';

                // Extract and validate range values
                const { startNum, endNum } = extractRangeValues(startExpr, endExpr, context);

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
        }

        // For non-range expressions, do regular validation
        if (!this.check(expression)) {
            throw new Error('Invalid for loop syntax');
        }

        // Process based on loop type
        const loopType = getLoopType(expression);

        switch (loopType) {
            case LoopType.Times: {
                // Parse and validate times loop before passing to handler
                const timesParts = parts[0];
                let count;

                // Try to get the count from context if it's a variable
                count = context.get(timesParts);

                // If not in context, try as a literal number
                if (count === undefined) {
                    count = Number(timesParts);
                    if (isNaN(count)) {
                        throw new Error(`Times loop requires a numeric value: '${timesParts}' is not a valid number`);
                    }
                }

                // Validate the count is an integer
                if (!Number.isInteger(count)) {
                    throw new Error('Times loop requires an integer value');
                }

                return handleTimesLoop(expression, context, template);
            }

            case LoopType.Range:
                // Handle both 'in' and 'of' for range loops
                if (parts[3] && parts[3].includes('..')) {
                    const rangeMatch = parts[3].match(/^(.+?)(\.{2,3})(.+?)$/);
                    if (rangeMatch) {
                        const [, startExpr, dots, endExpr] = rangeMatch;
                        const isExclusive = dots === '...';

                        // Extract and validate range values
                        const { startNum, endNum } = extractRangeValues(startExpr, endExpr, context);

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
                }
                return processRangeLoop(expression, template, context);

            case LoopType.Array: {
                // Parse the loop expression into parts
                const arrayParts = parseLoopParts(expression);

                // Validate the array before passing to handler
                const items = context.get(arrayParts.iterablePath);
                if (items === undefined) {
                    throw new Error(`Iterable '${arrayParts.iterablePath}' not found in context`);
                }
                if (!Array.isArray(items)) {
                    throw new Error(`'${arrayParts.iterablePath}' is not an array`);
                }

                return handleArrayIteration(arrayParts, context, template);
            }

            case LoopType.Object: {
                // Parse the loop expression into parts
                const objectParts = parseLoopParts(expression);

                // Validate the object before passing to handler
                const obj = context.get(objectParts.iterablePath);
                if (obj === undefined) {
                    throw new Error(`Object '${objectParts.iterablePath}' not found in context`);
                }
                if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
                    throw new Error(`'${objectParts.iterablePath}' is not an object`);
                }

                return handleObjectPropIteration(objectParts, context, template);
            }

            default:
                throw new Error('Invalid for loop syntax');
        }
    },
};
