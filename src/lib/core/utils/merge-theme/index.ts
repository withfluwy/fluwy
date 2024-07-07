import type { Any } from '$lib/core/contracts.js';
import { cn } from '../index.js';

export function mergeTheme(theme1: Any, theme2: Any) {
    const result: Any = {};
    if (!theme1 || !theme2) {
        return theme1 || theme2;
    }

    for (const key in theme1) {
        if (key in theme2) {
            const val1 = theme1[key];
            const val2 = theme2[key];
            if (typeof val1 === 'string' && typeof val2 === 'string') {
                result[key] = cn(val1, val2);
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
