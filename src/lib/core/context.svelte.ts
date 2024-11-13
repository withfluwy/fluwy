import type { Any, Context, RawContextData } from './contracts.js';
import { goto } from '$app/navigation';
import { writable } from 'svelte/store';

export function createContext(): Context {
    const data = $state<RawContextData>({
        svelteKit: { goto: (url: string) => goto(url) },
    });

    const context = $state<Context>({
        /**
         * @deprecated store is deprecated, use data instead
         */
        store: writable(data),
        data,

        fetch(url: string | URL | Request, fetchOptions?: RequestInit): Promise<Response> {
            return fetch(url, {
                method: 'GET',
                ...fetchOptions,
                headers: {
                    'Content-Type': 'application/json',
                    ...auth().headers(),
                    ...fetchOptions?.headers,
                },
            });
        },

        /**
         * @deprecated set is deprecated, use data attributes assignment instead
         */
        set(key: string, value: Any) {
            data[key] = value;
        },

        /**
         * @deprecated get is deprecated, use data attributes access instead
         */
        get(key: string) {
            return data[key];
        },
    });

    return context;
}

function auth() {
    return {
        user(path = 'auth_user') {
            return window.localStorage.getItem(path);
        },
        token(path = 'auth_token') {
            return window.localStorage.getItem(path);
        },
        headers({ token_path }: { token_path?: string } = {}): { [key: string]: string } {
            const token = this.token(token_path);

            if (!token) return {};

            return { Authorization: `Bearer ${token}` };
        },
    };
}
