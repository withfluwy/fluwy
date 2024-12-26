import * as cookies from '@/lib/core/operations/cookies/index.js';
import type { Operation } from '../../contracts.js';
import { get } from '@/lib/core/utils/index.js';

export const set_auth_token: Operation = async (tokenPath: string, { context, app }) => {
    const auth_token = get(context.data, tokenPath);

    return await cookies.set_operation({ auth_token }, { context, app });
};
