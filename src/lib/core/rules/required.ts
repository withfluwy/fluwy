import type { Rule } from './rule.js';

export class Required implements Rule {
    public readonly field = 'required';

    constructor(public message: string) {}

    async check(value: unknown): Promise<boolean> {
        if (value === null || value === undefined || String(value).trim() === '' || value === false) {
            return false;
        }

        if (Array.isArray(value) && value.length === 0) return false;

        // Only consider plain objects as potentially empty, not built-in objects or class instances
        if (
            typeof value === 'object' &&
            value !== null &&
            Object.getPrototypeOf(value) === Object.prototype &&
            Object.keys(value).length === 0
        ) {
            return false;
        }

        return true;
    }
}
