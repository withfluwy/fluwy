import * as cookies from '@/lib/core/operations/cookies/index.js';
import type { Operation } from '../../contracts.js';
import { compile, get } from '@/lib/core/utils/index.js';

export const set_auth_token: Operation = async (params: string | SetAuthTokenParams, { context, app }) => {
    /**
     * If params is a string, it's the path to the token. This is the default behavior.
     */
    const tokenPath = typeof params === 'string' ? params : params.path;
    const tokenName = typeof params === 'string' ? 'auth_token' : (params.name ?? 'auth_token');
    const token = get(context.data, tokenPath);

    if (!token) {
        throw new Error(`Invalid path for [set_auth_token] operation: ${tokenPath}. The value is undefined.`);
    }

    const options: { expires_at: number } = { expires_at: Date.now() + 15 * 60 * 1000 };
    if (typeof params !== 'string' && params?.expires_at !== undefined) {
        const exp = compile(params.expires_at, context.data);
        options.expires_at = typeof exp === 'string' ? Number(exp) * 1000 : exp * 1000;
    }

    return await cookies.set_operation(
        { [tokenName]: { value: token, expires_at: options.expires_at } },
        { context, app }
    );
};

export interface SetAuthTokenParams {
    /**
     * The name of the token to bet set in the cookie.
     */
    name?: string;
    /**
     * The path to the token in the context data.
     */
    path: string;
    /**
     * The date time in seconds when the token expires. This is the JWT `exp` claim.
     */
    expires_at?: string;
}
