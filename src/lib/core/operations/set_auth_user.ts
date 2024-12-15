import type { Operation } from '../contracts.js';
import { get } from '../utils/index.js';

export const set_auth_user: Operation = (path: string, { context }) => {
    const user = get(context.data, path);

    if (!user) throw new Error(`User not found in response at path [${path}]`);

    window.localStorage.setItem('auth_user', JSON.stringify(user));
};
