import { goto as sveltekitGoto } from '$app/navigation';
import { browser } from '$app/environment';
import { utils, type Operation } from '@/lib/index.js';

export const goto: Operation = (route: string, { context, app }) => {
    if (typeof route !== 'string') throw new Error('Goto operation requires a string argument');

    const parsedRoute = utils.compile(route, context.data);

    if (!browser) app.redirect(302, parsedRoute);
    if (parsedRoute.startsWith('http')) return (window.location.href = parsedRoute);

    return sveltekitGoto(parsedRoute);
};
