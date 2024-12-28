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

    const POST: RequestHandler = async ({ params, url, cookies, request }) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const authToken = cookies.get('auth_token');

        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const data = await request.json();

        return fetch(`${apiUrl}${params.path + url.search}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
    };

    const PUT: RequestHandler = async ({ params, url, cookies, request }) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const authToken = cookies.get('auth_token');

        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const data = await request.json();

        return fetch(`${apiUrl}${params.path + url.search}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
    };

    const PATCH: RequestHandler = async ({ params, url, cookies, request }) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const authToken = cookies.get('auth_token');

        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const data = await request.json();

        return fetch(`${apiUrl}${params.path + url.search}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
    };

    const DELETE: RequestHandler = async ({ params, url, cookies }) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        const authToken = cookies.get('auth_token');

        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        return fetch(`${apiUrl}${params.path + url.search}`, {
            method: 'DELETE',
            headers,
        });
    };

    return { GET, POST, PUT, PATCH, DELETE };
}

export const handle: Handle = async ({ event, resolve }) => {
    const route = event.url.pathname;
    const endpoint = route in endpoints ? endpoints[route] : null;

    if (endpoint) return endpoint(event);

    return resolve(event);
};
