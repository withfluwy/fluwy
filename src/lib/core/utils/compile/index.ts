import { get, has, expandObject } from '../index.js';
import type { Any } from '../../contracts.js';
import _ from 'lodash';

const { cloneDeep } = _;

type ContextData = Record<string, unknown>;

const PLACEHOLDERS = /\$\{([^}]+)\}/g;

export const hasPlaceholders = (template: string): boolean => new RegExp(PLACEHOLDERS).test(template);

export function compile(template: string, context: ContextData): Any {
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
        const isValidPath = has(expandedContext, placeholder);
        if (!isValidPath) return _match;

        const value = get(expandedContext, placeholder);
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
