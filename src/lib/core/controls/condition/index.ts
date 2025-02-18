import type { Any, Context, Template } from '@/lib/core/contracts.js';
import { get as getPath } from '@/lib/core/utils/get/index.js';

type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'is' | 'is not';
type ComparisonValue = string | number | boolean | null | undefined;

/**
 * Expression handler for 'if' conditions that supports:
 * - Variable comparisons (e.g., 'if response.status == 200')
 * - Logical operators (and, or, not)
 * - Numeric comparisons (>, >=, <, <=)
 * - Special values (null, undefined, true, false)
 */
export const if_expression = {
    check,

    evaluate,
};

export function check(expression: string): boolean {
    return expression.startsWith('if ');
}

export function evaluate(expression: string, context: Context): boolean {
    const condition = expression.substring(3).trim(); // remove 'if ' prefix
    return evaluateExpression(condition, context);
}

export type Condition = {
    [condition: string]: Template;
};

type ConditionEntry = [string, Template];

type ConditionalBlock = {
    condition: string;
    template: Template;
};

/**
 * Extracts and validates the main 'if' condition from the entries.
 * Throws an error if no 'if' condition is found or if multiple are present.
 */
function extractMainCondition(entries: ConditionEntry[]): ConditionalBlock {
    const mainIfEntries = entries.filter(([key]) => key.startsWith('if ') && !key.startsWith('else if'));

    if (mainIfEntries.length === 0) {
        throw new Error('No if condition found');
    }
    if (mainIfEntries.length > 1) {
        throw new Error('Multiple if conditions are not allowed');
    }

    const [condition, template] = mainIfEntries[0];
    return { condition, template };
}

/**
 * Extracts all 'else if' conditions from the entries in their original order.
 */
function extractElseIfConditions(entries: ConditionEntry[]): ConditionalBlock[] {
    return entries
        .filter(([key]) => key.startsWith('else if '))
        .map(([condition, template]) => ({
            condition: condition.substring(5), // Remove 'else ' prefix
            template,
        }));
}

/**
 * Extracts the 'else' template from the entries if present.
 */
function extractElseTemplate(entries: ConditionEntry[]): Template | undefined {
    return entries.find(([key]) => key === 'else')?.[1];
}

/**
 * Parses a condition object and returns the appropriate template based on the evaluation results.
 * Supports 'if', 'else if', and 'else' conditions.
 *
 * @example
 * ```ts
 * const result = parseCondition({
 *   'if response.status is 200': { text: 'OK' },
 *   'else if response.status >= 400': { text: 'Error' },
 *   'else': { text: 'Unknown' }
 * }, context);
 * ```
 */
export function parseCondition(condition: Condition, context: Context): Template {
    const entries = Object.entries(condition);

    // Extract and validate all parts of the conditional
    const mainIf = extractMainCondition(entries);
    const elseIfs = extractElseIfConditions(entries);
    const elseTemplate = extractElseTemplate(entries);

    // Evaluate main if condition
    if (evaluate(mainIf.condition, context)) {
        return mainIf.template;
    }

    // Evaluate else if conditions in order
    for (const { condition, template } of elseIfs) {
        if (evaluate(condition, context)) {
            return template;
        }
    }

    // Return else template if present
    return elseTemplate;
}

/**
 * Evaluates a complex expression that may contain logical operators (and, or, not)
 * and nested parentheses.
 */
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

    // Handle logical operators in order of precedence
    if (expression.trim().startsWith('not ')) {
        return !evaluateExpression(expression.substring(4), context);
    }

    if (expression.includes(' || ')) {
        return expression.split(' || ').some((expr) => evaluateExpression(expr.trim(), context));
    }

    if (expression.includes(' or ')) {
        return expression.split(' or ').some((expr) => evaluateExpression(expr.trim(), context));
    }

    if (expression.includes(' && ')) {
        return expression.split(' && ').every((expr) => evaluateExpression(expr.trim(), context));
    }

    if (expression.includes(' and ')) {
        return expression.split(' and ').every((expr) => evaluateExpression(expr.trim(), context));
    }

    return evaluateCondition(expression.trim(), context.data);
}

/**
 * Evaluates a single condition without logical operators.
 * Supports various comparison operators and special values.
 */
function evaluateCondition(condition: string, data: Any): boolean {
    const parts = condition.split(/\s+/);

    // Handle single value condition (e.g., "valid")
    if (parts.length === 1) {
        return evaluateSingleValue(parts[0], data);
    }

    // Handle array/object membership
    if (parts.length === 3 && parts[1] === 'in') {
        return evaluateInOperator(parts[0], parts[2], data);
    }

    // Handle "is not" as a special case
    if (parts.length === 4 && parts[1] === 'is' && parts[2] === 'not') {
        return evaluateComparison(parts[0], 'is not', parts[3], data);
    }

    if (parts.length !== 3) return false;

    const [leftPath, operator, rightValue] = parts;
    return evaluateComparison(leftPath, operator as Operator, rightValue, data);
}

/**
 * Evaluates a single value as a boolean.
 */
function evaluateSingleValue(value: string, data: Any): boolean {
    const contextValue = getPath(data, value);
    if (contextValue !== undefined) {
        return Boolean(contextValue);
    }

    if (value === 'true') return true;
    if (value === 'false') return false;

    return false;
}

/**
 * Evaluates the 'in' operator for arrays and objects.
 */
function evaluateInOperator(value: string, containerPath: string, data: Any): boolean {
    const container = getPath(data, containerPath);
    if (!container) return false;

    const searchValue = parseValue(value);

    if (Array.isArray(container)) {
        return container.includes(searchValue);
    }

    return Object.prototype.hasOwnProperty.call(container, String(searchValue));
}

/**
 * Evaluates a comparison between two values using the specified operator.
 */
function evaluateComparison(leftPath: string, operator: Operator, rightValue: string, data: Any): boolean {
    const leftValue = getPath(data, leftPath);

    // Handle special values
    switch (rightValue) {
        case 'null':
            return operator === 'is' || operator === '==' ? leftValue === null : leftValue !== null;
        case 'undefined':
            return operator === 'is' || operator === '==' ? leftValue === undefined : leftValue !== undefined;
        case 'nil': {
            const isNil = leftValue === null || leftValue === undefined;
            return operator === 'is' || operator === '==' ? isNil : !isNil;
        }
        case 'true':
            return operator === 'is' || operator === '==' ? leftValue === true : leftValue !== true;
        case 'false':
            return operator === 'is' || operator === '==' ? leftValue === false : leftValue !== false;
    }

    // Handle string literals and numeric values
    const resolvedRightValue = resolveValue(rightValue, data);

    if (isNumericComparison(operator)) {
        return evaluateNumericComparison(leftValue, operator, resolvedRightValue);
    }

    switch (operator) {
        case '==':
        case 'is':
            return compareValues(leftValue, resolvedRightValue);
        case '!=':
        case 'is not':
            return !compareValues(leftValue, resolvedRightValue);
        default:
            return false;
    }
}

/**
 * Checks if the operator is for numeric comparison.
 */
function isNumericComparison(operator: Operator): boolean {
    return ['>', '>=', '<', '<='].includes(operator);
}

/**
 * Evaluates numeric comparisons between two values.
 */
function evaluateNumericComparison(left: unknown, operator: Operator, right: unknown): boolean {
    const leftNum = Number(left);
    const rightNum = Number(right);

    if (isNaN(leftNum) || isNaN(rightNum)) return false;

    switch (operator) {
        case '>':
            return leftNum > rightNum;
        case '>=':
            return leftNum >= rightNum;
        case '<':
            return leftNum < rightNum;
        case '<=':
            return leftNum <= rightNum;
        default:
            return false;
    }
}

/**
 * Resolves a value from either the context or parses it as a literal.
 */
function resolveValue(value: string, data: Any): ComparisonValue {
    // Try to resolve from context first
    const contextValue = getPath(data, value);
    if (contextValue !== undefined) {
        return contextValue;
    }

    // Handle string literals
    if (value.startsWith('"') || value.startsWith("'")) {
        return value.slice(1, -1);
    }

    // Handle boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle numeric values
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }

    return value;
}

/**
 * Compares two values for equality, handling type-specific comparisons.
 */
function compareValues(left: unknown, right: unknown): boolean {
    // Handle numeric comparisons
    if (typeof right === 'number') {
        return typeof left === 'number' && left === right;
    }

    // Handle boolean comparisons
    if (typeof right === 'boolean') {
        return typeof left === 'boolean' && left === right;
    }

    // Handle string comparisons
    if (typeof right === 'string') {
        return typeof left === 'string' && left === right;
    }

    // Handle direct comparison for other types
    return left === right;
}

/**
 * Parses a string value into its appropriate type.
 */
function parseValue(value: string): ComparisonValue {
    // Handle special values
    if (value === 'nil') return null;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle string literals
    if (value.startsWith('"') || value.startsWith("'")) {
        return value.slice(1, -1);
    }

    // Handle numeric values
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }

    return value;
}
