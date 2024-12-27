import * as cookies from '@/lib/core/operations/cookies/index.js';
import type { Operation } from '../../contracts.js';
import { get } from '@/lib/core/utils/index.js';

export const set_auth_token: Operation = async (params: string | SetAuthTokenParams, { context, app }) => {
    /**
     * If params is a string, it's the path to the token. This is the default behavior.
     */
    const tokenPath = typeof params === 'string' ? params : params.path;
    const tokenName = typeof params === 'string' ? 'auth_token' : (params.name ?? 'auth_token');
    const token = get(context.data, tokenPath);

    return await cookies.set_operation({ [tokenName]: token }, { context, app });
};

export interface SetAuthTokenParams {
    name?: string;
    path: string;
}
