import type { Operation } from '@/lib/core/contracts.js';
import * as cookies from '@/lib/core/operations/cookies/index.js';

export const unset_auth_token: Operation = (params: string | undefined, { context, app }) => {
    const tokenName = params || 'auth_token';
    context.set(tokenName, undefined);
    return cookies.unset_operation(tokenName, { context, app });
};
