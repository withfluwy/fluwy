import type { Operation } from '@/lib/core/contracts.js';
import { UnauthenticatedError } from '@/lib/core/errors/index.js';

export interface AuthenticateParams {
    redirect?: string;
}

export const authenticate: Operation = async (params: AuthenticateParams | undefined, { context }) => {
    if (!context.get('auth_token')) unauthenticated(params);
};

export function unauthenticated(params: AuthenticateParams | undefined) {
    throw new UnauthenticatedError(params);
}
