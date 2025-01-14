import type { Any, Context, Expression } from '@/lib/core/contracts.js';
import { get as getPath } from '@/lib/core/utils/get/index.js';

export const if_expression = {
    check: (expression) => {
        return expression.startsWith('if ');
    },

    evaluate: (expression, context) => {
        const condition = expression.substring(3).trim(); // remove 'if ' prefix
        return evaluateExpression(condition, context);
    },
} satisfies Expression;

function evaluateExpression(expression: string, context: Context): boolean {
    // Handle parentheses first
    const parenRegex = /\(([^()]+)\)/g;
    let match;
    while ((match = parenRegex.exec(expression)) !== null) {
        const [fullMatch, group] = match;
        const result = evaluateExpression(group, context);
        expression = expression.slice(0, match.index) + result + expression.slice(match.index + fullMatch.length);
        parenRegex.lastIndex = 0; // Reset regex after modifying string
    }

    // Handle not operator
    if (expression.trim().startsWith('not ')) {
        return !evaluateExpression(expression.substring(4), context);
    }

    // Handle or operator
    if (expression.includes(' or ')) {
        return expression.split(' or ').some((expr) => evaluateExpression(expr.trim(), context));
    }

    // Handle and operator
    if (expression.includes(' and ')) {
        return expression.split(' and ').every((expr) => evaluateExpression(expr.trim(), context));
    }

    return evaluateCondition(expression.trim(), context.data);
}

function evaluateCondition(condition: string, data: Any): boolean {
    const parts = condition.split(/\s+/);

    // Handle single value condition (e.g., "valid")
    if (parts.length === 1) {
        if (parts[0] === 'true') return true;
        if (parts[0] === 'false') return false;
        const value = getPath(data, parts[0]);
        return Boolean(value);
    }

    // Handle "in" operator for arrays and objects
    if (parts.length === 3 && parts[1] === 'in') {
        const [value, , path] = parts;
        const container = getPath(data, path);

        // Remove quotes if present
        const searchValue =
            value.startsWith('"') || value.startsWith("'")
                ? value.slice(1, -1)
                : isNaN(Number(value))
                  ? value
                  : Number(value);

        if (Array.isArray(container)) {
            return container.includes(searchValue);
        }
        return container ? Object.prototype.hasOwnProperty.call(container, searchValue) : false;
    }

    // Handle "is not" as a special case
    if (parts.length === 4 && parts[1] === 'is' && parts[2] === 'not') {
        const [leftPath, , , rightValue] = parts;
        const leftValue = getPath(data, leftPath);
        return !compareValues(leftValue, rightValue);
    }

    if (parts.length !== 3) return false;

    const [leftPath, operator, rightValue] = parts;
    const leftValue = getPath(data, leftPath);

    // Handle different operators
    switch (operator) {
        case '==':
        case 'is':
            return compareValues(leftValue, rightValue);
        case '!=':
            return !compareValues(leftValue, rightValue);
        case '>':
            return Number(leftValue) > Number(rightValue);
        case '>=':
            return Number(leftValue) >= Number(rightValue);
        case '<':
            return Number(leftValue) < Number(rightValue);
        case '<=':
            return Number(leftValue) <= Number(rightValue);
        default:
            return false;
    }
}

function compareValues(leftValue: unknown, rightValue: string): boolean {
    // Handle special values
    if (rightValue === 'nil') return leftValue === null || leftValue === undefined;
    if (rightValue === 'null') return leftValue === null;
    if (rightValue === 'undefined') return leftValue === undefined;
    if (rightValue === 'true') return leftValue === true || leftValue === 'true';
    if (rightValue === 'false') return leftValue === false || leftValue === 'false';

    // Handle string literals
    if (rightValue.startsWith('"') || rightValue.startsWith("'")) {
        return leftValue === rightValue.slice(1, -1);
    }

    // Handle numeric comparison
    if (!isNaN(Number(rightValue))) {
        return leftValue === Number(rightValue);
    }

    // Handle direct comparison
    return leftValue === rightValue;
}
