import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { set_auth_token } from './index.js';
import * as cookies from '@/lib/core/operations/cookies/index.js';
import { createContext } from '@/lib/core/context/index.js';
import { createApp, utils } from '@/lib/index.js';

vi.mock('@/lib/core/operations/cookies/index.js', () => ({
    set_operation: vi.fn(),
    unset_operation: vi.fn(),
}));

describe('set_auth_token', () => {
    const currentDate = new Date('2024-12-01T08:00:00-08:00');
    const defaultExpectedExpiresAt = new Date('2024-12-01T08:15:00-08:00');

    beforeEach(() => {
        vi.setSystemTime(currentDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should set auth token from the specified path in context data', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token('response.token', { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith(
            { auth_token: { value: 'test-token', expires_at: defaultExpectedExpiresAt.getTime() } },
            { context, app }
        );
    });

    it('should throw error when path is invalid', async () => {
        const context = createContext();
        const app = createApp();

        expect(async () => await set_auth_token('invalid.path', { context, app })).rejects.toThrow(
            'Invalid path for [set_auth_token] operation: invalid.path. The value is undefined.'
        );
    });

    it('should set custom token name when using object parameters', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token({ path: 'response.token', name: 'custom_token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith(
            { custom_token: { value: 'test-token', expires_at: defaultExpectedExpiresAt.getTime() } },
            { context, app }
        );
    });

    it('should throw error when path is invalid with object parameters', async () => {
        const context = createContext();
        const app = createApp();

        expect(
            async () => await set_auth_token({ path: 'invalid.path', name: 'custom_token' }, { context, app })
        ).rejects.toThrow('Invalid path for [set_auth_token] operation: invalid.path. The value is undefined.');
    });

    it('should use default auth_token name when not specified in object parameters', async () => {
        const context = createContext();
        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token({ path: 'response.token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith(
            { auth_token: { value: 'test-token', expires_at: defaultExpectedExpiresAt.getTime() } },
            { context, app }
        );
    });

    it('should use default expiry date of 15 minutes if not specified in object parameters', async () => {
        const context = createContext();

        context.set('response', { token: 'test-token' });
        const app = createApp();

        await set_auth_token({ path: 'response.token' }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith(
            { auth_token: { value: 'test-token', expires_at: defaultExpectedExpiresAt.getTime() } },
            { context, app }
        );
    });

    it('should handle expires_at as string', async () => {
        const app = createApp();
        const context = createContext();
        const expectedExpiresAtInSeconds = Math.floor(defaultExpectedExpiresAt.getTime() / 1000);
        const expires_at = String(expectedExpiresAtInSeconds); // in seconds
        context.set('response', { token: 'test-token' });

        await set_auth_token({ path: 'response.token', expires_at }, { context, app });

        expect(cookies.set_operation).toHaveBeenCalledWith(
            { auth_token: { value: 'test-token', expires_at: expectedExpiresAtInSeconds * 1000 } },
            { context, app }
        );
    });

    it('should handle expires_at as path for the compiled value', async () => {
        // Arrange
        const context = createContext();
        const response = {
            token: 'test-token',
            exp: 1717225200, // June 01, 2024 12:00:00 AM PST
        };
        context.set('response', response);
        const app = createApp();
        const expected_expires_in_ms = new Date(response.exp * 1000).getTime();
        vi.spyOn(utils, 'compile');

        // Act
        await set_auth_token({ path: 'response.token', expires_at: 'response.exp' }, { context, app });

        // Assert
        expect(cookies.set_operation).toHaveBeenCalledWith(
            { auth_token: { value: 'test-token', expires_at: expected_expires_in_ms } },
            { context, app }
        );
        expect(utils.compile).toHaveBeenCalledWith('response.exp', context.data);
    });
});
