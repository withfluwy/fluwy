import { endpoints } from '@/lib/core/operations/cookies/index.js';
import type { Handle, RequestHandler } from '@sveltejs/kit';

export function createProxyApiHandlers(apiUrl: string) {
    const GET: RequestHandler = async ({ params, url, cookies }) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const authToken = cookies.get('auth_token');

        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        return fetch(`${apiUrl}${params.path + url.search}`, {
            method: 'GET',
            headers,
        });
    };

    return { GET };
}

export const handle: Handle = async ({ event, resolve }) => {
    const route = event.url.pathname;
    const endpoint = route in endpoints ? endpoints[route] : null;

    if (endpoint) return endpoint(event);

    return resolve(event);
};
