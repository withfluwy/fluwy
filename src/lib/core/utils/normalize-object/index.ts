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

    for (const [path, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // For nested objects that don't use dot notation, expand them recursively
            if (!path.includes('.')) {
                result[path] = expandObject(value as Record<string, unknown>);
                continue;
            }
        }

        // Handle dot notation for all other cases
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
            current[parts[parts.length - 1]] = value;
        } else {
            // If no dots in path, just set it directly
            result[path] = value;
        }
    }

    return result;
}
