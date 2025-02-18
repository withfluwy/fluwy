import type { Any } from '@/lib/core/contracts.js';
import { expandObject } from '@/lib/core/utils/normalize-object/index.js';

export function get(record: Record<string, Any>, path: string, defaultValue?: Any): Any {
    if (record === undefined) return defaultValue;
    if (!path.includes('.')) {
        const value = record[path];

        if (value === null) return defaultValue ?? value;

        return record[path] ?? defaultValue;
    }

    // First expand any dot notation keys into nested objects
    const expanded = expandObject(record);
    let value = expanded;

    const pathParts = path.split('.');

    for (const part of pathParts) {
        if (value === undefined || value === null) break;
        value = value[part] as Any;
    }

    if (value === null) return defaultValue ?? value;

    return value ?? defaultValue;
}
