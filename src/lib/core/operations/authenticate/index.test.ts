import { describe, it, expect } from 'vitest';
import { authenticate, unauthenticated } from './index.js';
import { UnauthenticatedError } from '@/lib/core/errors/index.js';
import { createApp, createContext } from '@/lib/index.js';

describe('authenticate operation', () => {
    it('should not throw when auth_token is present', async () => {
        const context = createContext();
        context.set('auth_token', 'valid-token');
        const app = createApp();

        await expect(authenticate(undefined, { context, app })).resolves.not.toThrow();
    });

    it('should throw UnauthenticatedError when auth_token is missing', async () => {
        const context = createContext();
        const params = { redirect: '/login' };
        const app = createApp();

        await expect(authenticate(params, { context, app })).rejects.toThrow(UnauthenticatedError);
    });
});

describe('unauthenticated function', () => {
    it('should throw UnauthenticatedError with params', () => {
        const params = { redirect: '/login' };

        expect(() => unauthenticated(params)).toThrow(UnauthenticatedError);
    });

    it('should throw UnauthenticatedError without params', () => {
        expect(() => unauthenticated(undefined)).toThrow(UnauthenticatedError);
    });
});
