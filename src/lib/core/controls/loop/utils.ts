import type { Any, Context, ContextData } from '@/lib/core/contracts.js';
import type { LoopItem } from './types.js';
import { compile } from '@/lib/core/utils/compile/index.js';

/**
 * Recursively compiles all string values in an object using the template engine.
 */
export function compileObject(obj: Any, context: Any): Any {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => compileObject(item, context));
    }

    const result: Any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = compile(value, context);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = compileObject(value, context);
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * Compiles a template with the given context and returns a LoopItem.
 */
export function compileTemplate(template: Any, loopContext: ContextData, parentContext: Any): LoopItem {
    // Create a new context by merging the parent context with loop variables
    // This will override the parent context variables with the same names
    const mergedContext = { ...parentContext, ...loopContext };

    if (typeof template === 'object') {
        if (Array.isArray(template)) {
            // Not handling array templates here as they need special processing
            throw new Error('Array templates should be processed separately');
        } else if ('text' in template) {
            // If it's a text template, compile it directly
            const compiledText = compile(template.text, mergedContext);
            return { template: { text: compiledText }, context: loopContext };
        } else {
            const compiledTemplate = compileObject(template, mergedContext);
            return { template: compiledTemplate, context: loopContext };
        }
    } else if (typeof template === 'string') {
        const compiledText = compile(template, mergedContext);
        return { template: { text: compiledText }, context: loopContext };
    } else {
        return { template, context: loopContext };
    }
}

/**
 * Represents the parsed components of a loop expression.
 */
export type LoopParts = {
    prefix: string;
    itemVar: string;
    operator: 'in' | 'of';
    iterablePath: string;
    indexVar?: string;
};

/**
 * Parses a loop expression into its component parts.
 */
export function parseLoopParts(expression: string): LoopParts {
    const parts = expression.split(/\s+/);

    if (parts.length < 4) {
        throw new Error('Invalid for loop syntax');
    }

    const [prefix, itemVar, operator, iterablePath, ...rest] = parts;

    if (prefix !== 'for' && prefix !== 'each') {
        throw new Error('Invalid for loop syntax: must start with "for" or "each"');
    }

    if (operator !== 'of' && operator !== 'in') {
        throw new Error('Invalid for loop syntax: must use "of" or "in"');
    }

    let indexVar = undefined;

    if (rest.length > 0) {
        if (rest[0] === 'with' && rest.length === 2) {
            indexVar = rest[1];
        } else {
            throw new Error('Invalid for loop syntax: index variable must use "with" keyword');
        }
    }

    return { prefix, itemVar, operator, iterablePath, indexVar };
}

/**
 * Extracts a variable value from context, handling various formats.
 */
export function getVariableFromContext(varExpr: string, context: Context): Any {
    // Check if it's in ${varName} format
    const templateMatch = varExpr.match(/^\$\{(.+?)\}$/);
    if (templateMatch) {
        const varName = templateMatch[1];
        const value = context.get(varName);
        if (value === undefined) {
            throw new Error(`Variable '${varName}' not found in context`);
        }
        return value;
    }
    
    // Try to get from context directly
    const value = context.get(varExpr);
    if (value !== undefined) {
        return value;
    }
    
    // Try as a literal number
    const numValue = Number(varExpr);
    if (!isNaN(numValue)) {
        return numValue;
    }
    
    // If we got here, the variable doesn't exist
    throw new Error(`Variable '${varExpr}' is not a valid number or context variable`);
}

/**
 * Type for loop expression inputs
 */
export type ForLoop = {
    [expression: string]: Any;
};

/**
 * Type for templates
 */
export type LoopTemplate = Any;
