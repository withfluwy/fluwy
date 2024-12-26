import { describe, it, expect, vi, beforeEach } from 'vitest';
import { set_operation, unset_operation, endpoints } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';

vi.mock('../../utils/compile/index.js', () => ({
    compile: vi.fn((value, data) => {
        // Simple mock implementation that replaces {{ variable }} with actual value
        if (typeof value === 'string' && value.includes('{{')) {
            const match = value.match(/{{(.+?)}}/);
            if (match) {
                const path = match[1].trim().split('.');
                let result = data;
                for (const key of path) {
                    result = result[key];
                }
                return result;
            }
        }
        return value;
    }),
}));

describe('cookies operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    describe('set_operation', () => {
        it('should send cookies to the server endpoint', async () => {
            const context = createContext();
            const app = createApp();
            context.set('user', { name: 'John' });

            await set_operation({ user_name: '{{ user.name }}' }, { context, app, previousResult: 'previous' });

            expect(global.fetch).toHaveBeenCalledWith('/__server__/set-cookie', {
                body: JSON.stringify({ user_name: 'John' }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should return previous result', async () => {
            const context = createContext();
            const app = createApp();
            const result = await set_operation({ test: 'value' }, { context, app, previousResult: 'previous' });

            expect(result).toBe('previous');
        });
    });

    describe('unset_operation', () => {
        it('should send unset request to the server endpoint', async () => {
            const context = createContext();
            const app = createApp();
            await unset_operation('test_cookie', { context, app, previousResult: 'previous' });

            expect(global.fetch).toHaveBeenCalledWith('/__server__/unset-cookie', {
                body: JSON.stringify({ test_cookie: true }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should return previous result', async () => {
            const context = createContext();
            const app = createApp();
            const result = await unset_operation('test_cookie', { context, app, previousResult: 'previous' });
            expect(result).toBe('previous');
        });
    });

    describe('server endpoints', () => {
        describe('/__server__/set-cookie', () => {
            it('should set cookies with correct headers', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({ test_cookie: 'test_value' }),
                    },
                    cookies: {
                        serialize: vi.fn().mockReturnValue('test_cookie=test_value; Path=/'),
                    },
                };

                const response = await endpoints['/__server__/set-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                expect(headers['set-cookie']).toBe('test_cookie=test_value; Path=/');
                expect(await response.json()).toEqual({ ok: true });
            });
        });

        describe('/__server__/unset-cookie', () => {
            it('should unset cookies with correct headers', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({ test_cookie: true }),
                    },
                    cookies: {
                        serialize: vi
                            .fn()
                            .mockReturnValue('test_cookie=true; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'),
                    },
                };

                const response = await endpoints['/__server__/unset-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                expect(headers['set-cookie']).toBe('test_cookie=true; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
                expect(await response.json()).toEqual({ removed: true });
            });
        });
    });
});
