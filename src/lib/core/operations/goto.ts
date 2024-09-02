import type { Operation } from '../contracts.js';
import { compile } from '../utils/compile/index.js';

export const goto: Operation = (yamlDoc, context) => {
    if (typeof yamlDoc !== 'string') throw new Error('Goto operation requires a string argument');
    if (!context.data.svelteKit) throw new Error('Goto operation requires a svelteKit context');
    if (yamlDoc.startsWith('http')) return (window.location.href = yamlDoc);

    return context.data.svelteKit.goto(compile(yamlDoc, context.data));
};
