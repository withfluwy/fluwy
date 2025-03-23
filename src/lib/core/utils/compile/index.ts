import { get, expandObject } from '../index.js';
import type { Any } from '../../contracts.js';
import _ from 'lodash';

const { cloneDeep } = _;

type ContextData = Record<string, unknown>;

const PLACEHOLDERS = /\$\{([^}]+)\}/g;

export const hasPlaceholders = (template: string): boolean => new RegExp(PLACEHOLDERS).test(template);

type CompileOptions = {
    /**
     * If true, unresolvable placeholders will be kept in the output.
     * If false (default), they will be replaced with empty strings.
     */
    keepPlaceholders?: boolean;
};

export function compile(
    template: string,
    context: ContextData,
    options: CompileOptions = { keepPlaceholders: true }
): Any {
    const havePlaceholders = hasPlaceholders(template);

    if (!havePlaceholders) {
        const whitespaces = /\s+/g;
        const hasWhitespaces = new RegExp(whitespaces).test(template);

        if (hasWhitespaces) return toJavascript(template);

        return get(context, template, template);
    }

    // Expand the context object to handle dot notation
    const expandedContext = expandObject(cloneDeep(context));

    // Use a regular expression to find all placeholders in the template
    const compiled = template.replace(PLACEHOLDERS, function (_match, placeholder) {
        // Handle multiple bracket notations and string literals
        let value: Any;

        // Extract path segments (both dots and brackets)
        const segments: string[] = [];
        let current = '';
        let inBracket = false;
        let inQuote = false;
        let quoteChar: string = '';

        for (let i = 0; i < placeholder.length; i++) {
            const char = placeholder[i];

            if (inQuote) {
                current += char;
                if (char === quoteChar) {
                    inQuote = false;
                }
            } else if (inBracket) {
                current += char;
                if (char === ']') {
                    inBracket = false;
                    segments.push(current);
                    current = '';
                } else if (char === '"' || char === "'") {
                    inQuote = true;
                    quoteChar = char;
                }
            } else if (char === '[') {
                if (current) {
                    segments.push(current);
                    current = '';
                }
                inBracket = true;
                current = char;
            } else if (char === '.') {
                if (current) {
                    segments.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current) {
            segments.push(current);
        }

        // Start with the first segment
        value = expandedContext[segments[0]];
        if (value === undefined) {
            return options.keepPlaceholders ? _match : '';
        }

        // Process remaining segments
        for (let i = 1; i < segments.length; i++) {
            const segment = segments[i];

            if (segment.startsWith('[')) {
                // Handle bracket notation
                const key = segment.slice(1, -1).replace(/^['"]|['"]$/g, '');
                const resolvedKey = expandedContext[key] ?? key;
                value = value?.[resolvedKey as keyof typeof value];
            } else {
                // Handle dot notation
                value = value?.[segment as keyof typeof value];
            }

            if (value === undefined) {
                return options.keepPlaceholders ? _match : '';
            }
        }

        return value ?? (options.keepPlaceholders ? _match : '');
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
