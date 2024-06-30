import type { Operation } from '../contracts';
import { compile } from '../utils/compile';

export const goto: Operation = (yamlDoc, context) => {
	if (typeof yamlDoc !== 'string') throw new Error('Goto operation requires a string argument');
	if (!context.data.svelteKit) throw new Error('Goto operation requires a svelteKit context');

	return context.data.svelteKit.goto(compile(yamlDoc, context.data));
};
