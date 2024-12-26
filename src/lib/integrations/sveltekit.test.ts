import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProxyApiHandlers, handle } from './sveltekit.js';
import { endpoints } from '@/lib/core/operations/cookies.js';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('@/lib/core/operations/cookies.js', () => ({
    endpoints: {
        '/test-endpoint': vi.fn(),
    },
}));

describe('createProxyApiHandlers', () => {
    const mockApiUrl = 'https://api.example.com';
    let handlers: ReturnType<typeof createProxyApiHandlers>;

    beforeEach(() => {
        handlers = createProxyApiHandlers(mockApiUrl);
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('should create a GET handler that forwards requests to the API', async () => {
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

    it('should create a GET handler that works without auth token', async () => {
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
