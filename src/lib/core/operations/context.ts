import type { Operation } from '../contracts.js';

export const context: Operation = async (variable: string, context) => {
    return context.get(variable);
};
