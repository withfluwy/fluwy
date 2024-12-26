import { describe, it, expect, vi } from 'vitest';
import { unset_auth_token } from './index.js';
import * as cookies from '@/lib/core/operations/cookies/index.js';
import { createContext } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';

vi.mock('@/lib/core/operations/cookies/index.js', () => ({
    set_operation: vi.fn(),
    unset_operation: vi.fn(),
}));

describe('unset_auth_token', () => {
    it('should unset auth token from context and cookies', async () => {
        const context = createContext();
        context.set('auth_token', 'test-token');
        const app = createApp();

        await unset_auth_token(undefined, { context, app });

        expect(context.get('auth_token')).toBeUndefined();
        expect(cookies.unset_operation).toHaveBeenCalledWith('auth_token', { context, app });
    });

    it('should work even if auth token is not set in context', async () => {
        const context = createContext();
        const app = createApp();

        await unset_auth_token(undefined, { context, app });

        expect(context.get('auth_token')).toBeUndefined();
        expect(cookies.unset_operation).toHaveBeenCalledWith('auth_token', { context, app });
    });
});
