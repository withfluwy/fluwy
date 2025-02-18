import type { Operation } from '@/lib/core/contracts.js';
import { compile } from '@/lib/core/utils/compile/index.js';

export const vars: Operation = async (params: Record<string, string>, { context }) => {
    for (const [varName, value] of Object.entries(params)) {
        const compiledValue = typeof value === 'string' ? compile(value, context.data) : value;
        context.set(varName, compiledValue);
    }
};
