/**
 * Contains functions for validating and checking loop expressions.
 */

/**
 * Helper to check if a string is a numeric value.
 */
function isNumeric(value: string): boolean {
    return !isNaN(Number(value));
}

/**
 * Helper to check if a string is an integer value.
 */
function isInteger(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && Number.isInteger(num);
}

/**
 * Checks if the provided expression is a valid loop expression.
 */
export function checkLoopExpression(expression: string): boolean {
    try {
        const parts = expression.split(/\s+/);

        // Times loop
        if (parts.length >= 2 && parts[1] === 'times') {
            // Basic times loop: '3 times do'
            if (parts.length === 3 && parts[2] === 'do') {
                return true;
            }

            // With variable times loop: '3 times with n do'
            if (parts.length === 5 && parts[2] === 'with' && parts[4] === 'do') {
                return true;
            }

            // Check if first part is a valid number
            if (parts[0]) {
                const num = parseInt(parts[0], 10);
                if (isNaN(num)) {
                    return false;
                }
                if (!isNaN(num) && !Number.isInteger(num)) {
                    return false;
                }
            }

            return false;
        }

        // Range loop
        if ((parts[0] === 'for' || parts[0] === 'each') && parts.length >= 4) {
            // We specifically want to reject expressions like 'for n of 1.3' that look like incorrect ranges
            if (parts[2] === 'of' && !parts[3].includes('..') && isNumeric(parts[3]) && !isInteger(parts[3])) {
                return false;
            }

            // range loop: we only accept the 'of' operator with ranges
            if (parts[2] === 'of' && parts[3] && parts[3].includes('..')) {
                // Check if it matches a proper range pattern
                const rangeMatch = parts[3].match(/^(.+?)(\.{2,3})(.+?)$/);
                if (!rangeMatch) {
                    return false;
                }

                // Ensure it's a valid range format
                const [, startExpr, , endExpr] = rangeMatch;

                // Check for decimal numbers in range bounds (we only allow integers)
                if (
                    // Check for direct literals with decimals
                    (isNumeric(startExpr) && !isInteger(startExpr)) ||
                    (isNumeric(endExpr) && !isInteger(endExpr))
                ) {
                    return false;
                }

                return true;
            }

            // Range expressions must use 'of', not 'in'
            if (parts[2] === 'in' && parts[3] && parts[3].includes('..')) {
                return false;
            }

            // Array/object iteration
            if (parts.length >= 4 && (parts[2] === 'in' || parts[2] === 'of')) {
                // With index variable
                if (parts.length === 6 && parts[4] === 'with') {
                    return true;
                } else if (parts.length === 5 && parts[4] === 'with') {
                    return false; // Missing index variable after 'with'
                } else if (parts.length > 6) {
                    return false; // Too many parts
                }
                return true; // Basic iteration without index
            }

            return false; // Invalid for/each syntax
        }

        return false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return false;
    }
}

/**
 * Identifies the type of loop expression.
 */
export enum LoopType {
    Times = 'times',
    Range = 'range',
    Array = 'array',
    Object = 'object',
    Invalid = 'invalid',
}

/**
 * Gets the type of loop from the expression.
 */
export function getLoopType(expression: string): LoopType {
    try {
        const parts = expression.split(/\s+/);

        // Times loop
        if (parts.length >= 2 && parts[1] === 'times') {
            return LoopType.Times;
        }

        // Range loop
        if ((parts[0] === 'for' || parts[0] === 'each') && parts.length >= 4 && parts[3].includes('..')) {
            return LoopType.Range;
        }

        // Array/object iteration
        if ((parts[0] === 'for' || parts[0] === 'each') && parts.length >= 4) {
            if (parts[2] === 'of') {
                return LoopType.Array;
            }
            if (parts[2] === 'in') {
                return LoopType.Object;
            }
        }

        return LoopType.Invalid;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return LoopType.Invalid;
    }
}
