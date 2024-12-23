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

/**
 * WARNING: This context must remain a pure JavaScript class, independent of Svelte.
 * It's used both server-side and client-side (in separate instances) for page rendering
 * and component interactions. Attaching it to Svelte's context or client-side only would prevent server-side usage.
 */
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
                    // FIXME(auth): fix how we get the auth token for the fetch of the context. Do we need the fetch in the
                    // context? Wouldn't it be better to have the token in the context and use a specific http client
                    // to make the requests based on the context? Maybe the app could do that?
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
