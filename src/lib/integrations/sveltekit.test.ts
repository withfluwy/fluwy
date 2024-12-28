import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProxyApiHandlers, handle } from './sveltekit.js';
import { endpoints } from '@/lib/core/operations/cookies/index.js';
import type { RequestEvent } from '@sveltejs/kit';

describe('createProxyApiHandlers', () => {
    const mockApiUrl = 'https://api.example.com';
    let handlers: ReturnType<typeof createProxyApiHandlers>;

    beforeEach(() => {
        handlers = createProxyApiHandlers(mockApiUrl);
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    describe('GET handler', () => {
        it('should forward requests to the API with auth token', async () => {
            const mockEvent = {
                params: { path: '/users' },
                url: { search: '?page=1' },
                cookies: { get: vi.fn().mockReturnValue('test-token') },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                request: new Request('http://localhost'),
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.GET(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users?page=1', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-token',
                },
            });
        });

        it('should work without auth token', async () => {
            const mockEvent = {
                params: { path: '/public' },
                url: { search: '' },
                cookies: { get: vi.fn().mockReturnValue(null) },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                request: new Request('http://localhost'),
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.GET(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    describe('POST handler', () => {
        it('should forward POST requests to the API with auth token and body', async () => {
            const mockBody = { name: 'test', value: 123 };
            const mockEvent = {
                params: { path: '/users' },
                url: { search: '' },
                cookies: { get: vi.fn().mockReturnValue('test-token') },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.POST(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-token',
                },
                body: JSON.stringify(mockBody),
            });
        });

        it('should work without auth token', async () => {
            const mockBody = { data: 'public-data' };
            const mockEvent = {
                params: { path: '/public' },
                url: { search: '?type=test' },
                cookies: { get: vi.fn().mockReturnValue(null) },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.POST(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/public?type=test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockBody),
            });
        });
    });

    describe('PUT handler', () => {
        it('should forward PUT requests to the API with auth token and body', async () => {
            const mockBody = { id: 1, name: 'updated' };
            const mockEvent = {
                params: { path: '/users/1' },
                url: { search: '' },
                cookies: { get: vi.fn().mockReturnValue('test-token') },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.PUT(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users/1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-token',
                },
                body: JSON.stringify(mockBody),
            });
        });

        it('should work without auth token', async () => {
            const mockBody = { data: 'public-update' };
            const mockEvent = {
                params: { path: '/public/1' },
                url: { search: '?version=2' },
                cookies: { get: vi.fn().mockReturnValue(null) },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.PUT(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/public/1?version=2', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockBody),
            });
        });
    });

    describe('PATCH handler', () => {
        it('should forward PATCH requests to the API with auth token and body', async () => {
            const mockBody = { status: 'active' };
            const mockEvent = {
                params: { path: '/users/1/status' },
                url: { search: '' },
                cookies: { get: vi.fn().mockReturnValue('test-token') },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.PATCH(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users/1/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-token',
                },
                body: JSON.stringify(mockBody),
            });
        });

        it('should work without auth token', async () => {
            const mockBody = { partial: 'update' };
            const mockEvent = {
                params: { path: '/public/partial' },
                url: { search: '?field=status' },
                cookies: { get: vi.fn().mockReturnValue(null) },
                request: {
                    json: vi.fn().mockResolvedValue(mockBody),
                },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.PATCH(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/public/partial?field=status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockBody),
            });
        });
    });

    describe('DELETE handler', () => {
        it('should forward DELETE requests to the API with auth token', async () => {
            const mockEvent = {
                params: { path: '/users/1' },
                url: { search: '' },
                cookies: { get: vi.fn().mockReturnValue('test-token') },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.DELETE(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users/1', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-token',
                },
            });
        });

        it('should work without auth token', async () => {
            const mockEvent = {
                params: { path: '/public/temp' },
                url: { search: '?permanent=true' },
                cookies: { get: vi.fn().mockReturnValue(null) },
                fetch: vi.fn(),
                getClientAddress: () => '127.0.0.1',
                locals: {},
                platform: {},
                isDataRequest: false,
                route: { id: null },
                setHeaders: vi.fn(),
            } as unknown as RequestEvent;

            await handlers.DELETE(mockEvent);

            expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/public/temp?permanent=true', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });
});

describe('handle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call endpoint handler if route exists in endpoints', async () => {
        const mockEvent = {
            url: { pathname: '/test-endpoint' },
        } as RequestEvent;
        const mockEndpointHandler = vi.fn();
        vi.mocked(endpoints)['/test-endpoint'] = mockEndpointHandler;

        await handle({ event: mockEvent, resolve: vi.fn() });

        expect(mockEndpointHandler).toHaveBeenCalledWith(mockEvent);
    });

    it('should call resolve if route does not exist in endpoints', async () => {
        const mockEvent = {
            url: { pathname: '/non-existent' },
        } as RequestEvent;
        const mockResolve = vi.fn();

        await handle({ event: mockEvent, resolve: mockResolve });

        expect(mockResolve).toHaveBeenCalledWith(mockEvent);
    });
});
