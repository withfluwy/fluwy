import { getContext, setContext as setContextSvelte } from 'svelte';
import type { Any } from '../contracts.js';
import { get, writable, type Writable } from 'svelte/store';
import { goto } from '$app/navigation';

export type Context = {
    store: ContextData;
    fetch: (url: string | URL | Request, fetchOptions?: RequestInit) => Promise<Response>;
    data: RawContextData;
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

/**
 * @deprecated use from context.svelte.js instead
 */
export function createContext() {
    const store = writable<RawContextData>({
        svelteKit: { goto: (url: string) => goto(url) },
    });

    const context = {
        store,

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

        get data() {
            return get(store);
        },

        set(key: string, value: Any) {
            store.update((context) => ({ ...context, [key]: value }));
        },

        get(key: string) {
            return get(store)[key];
        },
    };

    return context;
}

export type ContextData = Writable<RawContextData>;

export type RawContextData = {
    [key: string]: Any;
    svelteKit: {
        goto: (path: string) => Promise<void>;
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
