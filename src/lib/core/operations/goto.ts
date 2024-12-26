import type { Operation } from '../contracts.js';
import { compile } from '../utils/compile/index.js';
import { goto as sveltekitGoto } from '$app/navigation';

export const goto: Operation = (yamlDoc, { context }) => {
    if (typeof yamlDoc !== 'string') throw new Error('Goto operation requires a string argument');
    if (!context.data.svelteKit) throw new Error('Goto operation requires a svelteKit context');
    if (yamlDoc.startsWith('http')) return (window.location.href = yamlDoc);

    return sveltekitGoto(compile(yamlDoc, context.data));
};
