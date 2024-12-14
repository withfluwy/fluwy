import type { Any } from '@/lib/core/contracts.js';
import { isNil } from '@/lib/core/utils/index.js';
import { expandObject } from '@/lib/core/utils/normalize-object/index.js';

export function get(record: Record<string, Any>, path: string, defaultValue?: Any): Any {
    if (record === undefined) return defaultValue;
    if (!path.includes('.')) return record[path] ?? defaultValue;

    // First expand any dot notation keys into nested objects
    const expanded = expandObject(record);
    let value = expanded;

    if (isNil(value)) return value;

    const pathParts = path.split('.');

    for (const part of pathParts) {
        value = value[part] as Any;
        if (isNil(value)) break;
    }

    return value ?? defaultValue;
}
