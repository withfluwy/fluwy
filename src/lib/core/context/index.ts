import { getContext, setContext as setContextSvelte } from 'svelte';
import type { Any } from '../contracts.js';
import { goto } from '$app/navigation';
import { get, writable, type Writable } from 'svelte/store';

export type Context = {
    store: Writable<ContextData>;
    data: ContextData;
    set: (key: string, value: Any) => void;
    get: (key: string) => Any;
    cloneWith: (additionalData: Partial<ContextData>) => Context;
};

const contextKey = Symbol('context');

export function useContext(): Context {
    return getContext<Context>(contextKey);
}

export function setupContext(context: Context) {
    setContextSvelte(contextKey, context);
}

/**
 * WARNING: This context must remain a pure JavaScript class, independent of Svelte.
 * It's used both server-side and client-side (in separate instances) for page rendering
 * and component interactions. Attaching it to Svelte's context or client-side only would prevent server-side usage.
 */
export function createContext(initialData: Record<string, Any> = {}): Context {
    const store = writable<ContextData>({ svelteKit: { goto }, ...initialData });

    return {
        store,
        get data() {
            return get(store);
        },

        set(key: string, value: Any) {
            store.update((context) => ({ ...context, [key]: value }));
        },

        get(key: string) {
            return get(store)[key];
        },

        cloneWith(additionalData: Partial<ContextData>) {
            // Create a deep copy of the current context data
            const currentData = JSON.parse(JSON.stringify(get(store)));
            
            // Merge with the additional data (allowing overrides)
            return createContext({ ...currentData, ...additionalData });
        },
    } satisfies Context;
}

export type ContextData = {
    [key: string]: Any;
    svelteKit: {
        goto: typeof goto;
    };
};
