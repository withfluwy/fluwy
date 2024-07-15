import type { Any } from '$lib/core/contracts.js';
import { cn } from '../index.js';

export function mergeTheme(theme1: Any, theme2: Any) {
    const result: Any = {};
    const isUndefined = (value: unknown) => typeof value === 'undefined';

    if (theme1 === theme2) return theme2;

    if (isUndefined(theme1) || isUndefined(theme2)) {
        return theme2 ?? theme1;
    }

    if (typeof theme1 !== typeof theme2) {
        throw new Error(`Type mismatch on mergeTheme. One is ${typeof theme1} and the other is ${typeof theme2}`);
    }

    if (typeof theme1 !== 'object') {
        return theme2 ?? theme1;
    }

    for (const key in theme1) {
        if (typeof theme2 === 'string') {
            result[key] = cn(theme1[key], theme2);
        } else if (key in theme2) {
            const val1 = theme1[key];
            const val2 = theme2[key];

            if (val1 === val2) {
                result[key] = val2;
            } else if (typeof val1 === 'string' && typeof val2 === 'string') {
                const oneOfThemIsColor = isColor(val1) || isColor(val2);
                result[key] = oneOfThemIsColor ? val2 : cn(val1, val2);
            } else if (typeof val1 === typeof val2 && typeof val1 === 'object') {
                result[key] = mergeTheme(val1, val2);
            } else if (val1 === null || val2 === null) {
                result[key] = val1 || val2;
            } else {
                throw new Error(
                    `Property "${key}" is of type ${typeof val1} but the second one is of type ${typeof val2}`
                );
            }
        } else {
            result[key] = theme1[key];
        }
    }

    for (const key in theme2) {
        if (!(key in theme1)) {
            result[key] = theme2[key];
        }
    }

    return result;
}

const isColor = (value: string) => /^#[0-9a-fA-F]{3,6}$/.test(value);
