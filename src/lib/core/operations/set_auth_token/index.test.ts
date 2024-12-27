import { describe, it, expect, vi } from 'vitest';
import { set_auth_token } from './index.js';
import * as cookies from '@/lib/core/operations/cookies/index.js';
import { createContext } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';

vi.mock('@/lib/core/operations/cookies/index.js', () => ({
    set_operation: vi.fn(),
    unset_operation: vi.fn(),
}));

describe('set_auth_token', () => {
    it('should set auth token from the specified path in context data', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token('response.token', { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith({ auth_token: 'test-token' }, { context, app });
    });

    it('should handle undefined token path gracefully', async () => {
        const context = createContext();
        const app = createApp();

        await set_auth_token('invalid.path', { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith({ auth_token: undefined }, { context, app });
    });

    it('should set custom token name when using object parameters', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token({ path: 'response.token', name: 'custom_token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith({ custom_token: 'test-token' }, { context, app });
    });

    it('should handle undefined token path gracefully with object parameters', async () => {
        const context = createContext();
        const app = createApp();

        await set_auth_token({ path: 'invalid.path', name: 'custom_token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith({ custom_token: undefined }, { context, app });
    });

    it('should use default auth_token name when not specified in object parameters', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token({ path: 'response.token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith({ auth_token: 'test-token' }, { context, app });
    });
});
