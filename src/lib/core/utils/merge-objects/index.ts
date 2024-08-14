import type { Any } from '$lib/core/contracts.js';
import { cn } from '../index.js';

export function mergeObjects(obj1: Any, obj2: Any) {
    const result: Any = {};
    const isUndefined = (value: unknown) => typeof value === 'undefined';

    if (obj1 === obj2) return obj2;

    if (isUndefined(obj1) || isUndefined(obj2)) {
        return obj2 ?? obj1;
    }

    if (typeof obj1 !== typeof obj2) {
        throw new Error(`Type mismatch on mergeObjects. One is ${typeof obj1} and the other is ${typeof obj2}`);
    }

    if (typeof obj1 !== 'object') {
        return obj2 ?? obj1;
    }

    for (const key in obj1) {
        if (typeof obj2 === 'string') {
            result[key] = cn(obj1[key], obj2);
        } else if (key in obj2) {
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (val1 === val2) {
                result[key] = val2;
            } else if (typeof val1 === 'string' && typeof val2 === 'string') {
                const oneOfThemIsColor = isColor(val1) || isColor(val2);
                result[key] = oneOfThemIsColor ? val2 : cn(val1, val2);
            } else if (typeof val1 === typeof val2 && typeof val1 === 'object') {
                result[key] = mergeObjects(val1, val2);
            } else if (val1 === null || val2 === null) {
                result[key] = val1 || val2;
            } else {
                throw new Error(
                    `Property "${key}" is of type ${typeof val1} but the second one is of type ${typeof val2}`
                );
            }
        } else {
            result[key] = obj1[key];
        }
    }

    for (const key in obj2) {
        if (!(key in obj1)) {
            result[key] = obj2[key];
        }
    }

    return result;
}

const isColor = (value: string) => /^#[0-9a-fA-F]{3,6}$/.test(value);
