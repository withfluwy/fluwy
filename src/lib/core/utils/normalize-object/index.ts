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

	for (const [key, value] of Object.entries(obj)) {
		const keys = key.split('.');
		let current = result;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];

			if (!(key in current)) {
				current[key] = {};
			}

			current = current[key] as Record<string, unknown>;
		}

		current[keys[keys.length - 1]] = value;
	}

	return result;
}
