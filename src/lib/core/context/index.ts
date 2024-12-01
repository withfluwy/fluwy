import { getContext, setContext as setContextSvelte } from 'svelte';
import type { Any } from '../contracts.js';
import { goto } from '$app/navigation';
import { get, writable, type Writable } from 'svelte/store';

export type Context = {
    store: Writable<ContextData>;
    fetch: (url: string | URL | Request, fetchOptions?: RequestInit) => Promise<Response>;
    data: ContextData;
    set: (key: string, value: Any) => void;
    get: (key: string) => Any;
};

const contextKey = Symbol('context');

export function useContext(): Context {
    return getContext<Context>(contextKey);
}

export function setupContext(context: Context) {
    setContextSvelte(contextKey, context);
}

export function addContext(key: string, value: Any) {
    useContext().set(key, value);
}

export function createContext(): Context {
    const store = writable<ContextData>({ svelteKit: { goto } });

    return {
        store,
        get data() {
            return get(store);
        },

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

        set(key: string, value: Any) {
            store.update((context) => ({ ...context, [key]: value }));
        },

        get(key: string) {
            // return this.data[key];
            return get(store)[key];
        },
    } satisfies Context;
}

export type ContextData = {
    [key: string]: Any;
    svelteKit: {
        goto: typeof goto;
    };
};

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
