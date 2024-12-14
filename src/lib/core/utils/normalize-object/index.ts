export function collapseObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    function recurse(obj: Record<string, unknown>, path: string): void {
        for (const [key, value] of Object.entries(obj)) {
            const newPath = path ? `${path}.${key}` : key;

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                recurse(value as Record<string, unknown>, newPath);
            } else {
                result[newPath] = value;
            }
        }
    }

    recurse(obj, '');

    return result;
}

export function expandObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // First pass: handle non-dotted paths
    for (const [path, value] of Object.entries(obj)) {
        if (!path.includes('.')) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                result[path] = expandObject(value as Record<string, unknown>);
            } else {
                result[path] = value;
            }
        }
    }

    // Second pass: handle dotted paths and merge with existing objects
    for (const [path, value] of Object.entries(obj)) {
        if (path.includes('.')) {
            const parts = path.split('.');
            let current = result;

            // Create nested objects for each part except the last one
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!(part in current)) {
                    current[part] = {};
                }
                current = current[part] as Record<string, unknown>;
            }

            // Set the value at the deepest level
            const lastPart = parts[parts.length - 1];
            current[lastPart] = value;
        }
    }

    return result;
}
