import { ChangeNotifier } from './change-notifier.js';
import { writable, type Writable } from 'svelte/store';

/**
 * Creates a Svelte store that wraps a ChangeNotifier instance.
 * The store will update whenever the notifier triggers a change.
 * This is the recommended approach for Svelte.
 */
export function useChangeNotifier<T extends ChangeNotifier>(notifier: T): Writable<T> {
    const { subscribe, set } = writable(notifier);

    // Function to update the store when notifier changes
    const update = () => {
        set(notifier);
    };

    // Subscribe to changes immediately
    notifier.onChange(update);

    return {
        subscribe,
        set,
        update: (fn: (value: T) => T) => {
            const updated = fn(notifier);
            set(updated);
            return updated;
        }
    };
}
