import type { Operation } from '../contracts.js';

export const unset_local_storage: Operation = (key: string) => {
    window.localStorage.removeItem(key);
};
