import type { Operation } from '../contracts';

export const context: Operation = async (variable: string, context) => {
	return context.get(variable);
};
