import { get, has } from '../index.js';
import type { Any } from '../../contracts.js';

type ContextObject = Record<string, unknown>;

const PLACEHOLDERS = /\$\{([^}]+)\}/g;

export const hasPlaceholders = (template: string): boolean => new RegExp(PLACEHOLDERS).test(template);

export function compile(template: string, context: ContextObject): Any {
    const havePlaceholders = hasPlaceholders(template);

    if (!havePlaceholders) {
        const whitespaces = /\s+/g;
        const hasWhitespaces = new RegExp(whitespaces).test(template);

        if (hasWhitespaces) return toJavascript(template);

        return get(context, template, template);
    }

    // Use a regular expression to find all placeholders in the template
    const compiled = template.replace(PLACEHOLDERS, function (_match, placeholder) {
        const isValidPath = has(context, placeholder);
        if (!isValidPath) return _match;

        // Split the placeholder into parts (to handle nested properties)
        const keys = placeholder.split('.');

        // Reduce the keys to get the corresponding value from the context object
        const value = keys.reduce(function (currentContext: ContextObject, key: string) {
            if (typeof currentContext !== 'object') return {};

            // Return the next level of the context
            return currentContext[key] as ContextObject;
        }, context);

        const isNil = [null, undefined].includes(value);

        if (isValidPath && isNil) return '';

        return value !== undefined ? value : _match;
    });

    return toJavascript(compiled);
}

export function toJavascript(value: string): Any {
    const trimmed = value.trim();
    if (trimmed === '') return '';
    const isBoolean = ['true', 'false'].includes(trimmed);

    if (isBoolean) return trimmed === 'true';

    const isNumber = !isNaN(Number(trimmed));

    if (isNumber) return Number(trimmed);

    return value;
}
