import type { Operation } from '../contracts.js';
import { get } from '../utils/index.js';

export const set_auth_token: Operation = (tokenPath: string, context) => {
    const token = get(context.data, tokenPath);

    if (!token) throw new Error(`Auth Token not found in response at path [${tokenPath}]`);

    window.localStorage.setItem('auth_token', token);
};
