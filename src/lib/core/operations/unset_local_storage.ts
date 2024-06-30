import type { Operation } from '../contracts';

export const unset_local_storage: Operation = (key: string, context) => {
	window.localStorage.removeItem(key);
};
