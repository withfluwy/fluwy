import type { Operation } from '@/lib/core/contracts.js';
import * as cookies from '@/lib/core/operations/cookies/index.js';

export const unset_auth_token: Operation = (_, { context, app }) => {
    context.set('auth_token', undefined);
    return cookies.unset_operation('auth_token', { context, app });
};
