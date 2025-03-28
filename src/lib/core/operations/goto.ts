import type { Operation } from '../contracts.js';
import { compile } from '../utils/compile/index.js';
import { goto as sveltekitGoto } from '$app/navigation';
import { browser } from '$app/environment';

export const goto: Operation = (route: string, { context, app }) => {
    if (typeof route !== 'string') throw new Error('Goto operation requires a string argument');
    if (!context.data.svelteKit) throw new Error('Goto operation requires a svelteKit context');

    const parsedRoute = compile(route, context.data);

    if (!browser) app.redirect(302, parsedRoute);
    if (parsedRoute.startsWith('http')) return (window.location.href = parsedRoute);

    return sveltekitGoto(parsedRoute);
};
