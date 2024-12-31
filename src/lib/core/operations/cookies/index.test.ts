import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { set_operation, unset_operation, endpoints } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';

describe('cookies operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        vi.setSystemTime(new Date('2024-12-31T08:59:55-08:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('set_operation', () => {
        it('should send cookies to the server endpoint', async () => {
            const context = createContext();
            const app = createApp();
            context.set('user', { name: 'John' });

            await set_operation({ user_name: { value: '${user.name}' } }, { context, app, previousResult: 'previous' });

            expect(global.fetch).toHaveBeenCalledWith('/__server__/set-cookie', {
                body: JSON.stringify({ user_name: { value: 'John' } }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should return previous result', async () => {
            const context = createContext();
            const app = createApp();
            const result = await set_operation(
                { test: { value: 'value' } },
                { context, app, previousResult: 'previous' }
            );

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
            it('should not set cookies with default expiration', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({ test_cookie: { value: 'test_value' } }),
                    },
                    cookies: {
                        serialize: vi.fn().mockReturnValue('test_cookie=test_value; Path=/'),
                    },
                };

                const response = await endpoints['/__server__/set-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                expect(mockEvent.cookies.serialize).toHaveBeenCalledWith('test_cookie', 'test_value', {
                    path: '/',
                });
                expect(headers['set-cookie']).toBe('test_cookie=test_value; Path=/');
                expect(await response.json()).toEqual({ ok: true });
            });

            it('should set cookies with custom duration', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({
                            test_cookie: {
                                value: 'test_value',
                                duration: 3600,
                            },
                        }),
                    },
                    cookies: {
                        serialize: vi
                            .fn()
                            .mockReturnValue('test_cookie=test_value; Path=/; Expires=Tue, 31 Dec 2024 17:59:55 GMT'),
                    },
                };

                const response = await endpoints['/__server__/set-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                const expectedExpires = new Date('2024-12-31T08:59:55-08:00');
                expectedExpires.setSeconds(expectedExpires.getSeconds() + 3600);

                expect(mockEvent.cookies.serialize).toHaveBeenCalledWith('test_cookie', 'test_value', {
                    path: '/',
                    expires: expectedExpires,
                });
                expect(headers['set-cookie']).toBe(
                    'test_cookie=test_value; Path=/; Expires=Tue, 31 Dec 2024 17:59:55 GMT'
                );
                expect(await response.json()).toEqual({ ok: true });
            });

            it('should set cookies with expires_at date', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({
                            test_cookie: {
                                value: 'test_value',
                                expires_at: '2024-12-31T09:30:00-08:00',
                            },
                        }),
                    },
                    cookies: {
                        serialize: vi
                            .fn()
                            .mockReturnValue('test_cookie=test_value; Path=/; Expires=Tue, 31 Dec 2024 17:30:00 GMT'),
                    },
                };

                const response = await endpoints['/__server__/set-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                const expectedExpires = new Date('2024-12-31T09:30:00-08:00');

                expect(mockEvent.cookies.serialize).toHaveBeenCalledWith('test_cookie', 'test_value', {
                    path: '/',
                    expires: expectedExpires,
                });
                expect(headers['set-cookie']).toBe(
                    'test_cookie=test_value; Path=/; Expires=Tue, 31 Dec 2024 17:30:00 GMT'
                );
                expect(await response.json()).toEqual({ ok: true });
            });

            it('should convert non-string values to strings', async () => {
                const mockEvent = {
                    request: {
                        json: vi.fn().mockResolvedValue({ test_cookie: { value: 123 } }),
                    },
                    cookies: {
                        serialize: vi.fn().mockReturnValue('test_cookie=123; Path=/'),
                    },
                };

                const response = await endpoints['/__server__/set-cookie'](mockEvent);
                const headers = Object.fromEntries(response.headers.entries());

                expect(mockEvent.cookies.serialize).toHaveBeenCalledWith('test_cookie', '123', {
                    path: '/',
                });
                expect(headers['set-cookie']).toBe('test_cookie=123; Path=/');
                expect(await response.json()).toEqual({ ok: true });
            });

            it('should handle legacy string values', async () => {
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

                expect(mockEvent.cookies.serialize).toHaveBeenCalledWith('test_cookie', 'test_value', {
                    path: '/',
                });
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
