import type { AuthenticateParams } from '@/lib/core/operations/authenticate/index.js';

export class UnauthenticatedError extends Error {
    public params: AuthenticateParams | undefined;

    constructor(params: AuthenticateParams | undefined) {
        super('Unauthenticated');
        this.params = params;
    }
}

export class AbortOperationError extends Error {}
