import { expect, describe, it, beforeEach, vi } from 'vitest';
import { get } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';
import type { Application } from '@/lib/core/app/index.js';

describe('get', () => {
    let context: Context;
    let mockFetch: ReturnType<typeof vi.fn>;
    let app: Application;

    beforeEach(() => {
        app = createApp();
        context = createContext();
        mockFetch = vi.fn();
        global.fetch = mockFetch;
    });

    it('should make a successful GET request with string param', async () => {
        const responseData = { success: true };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        const result = await get('https://api.example.com/data', { context, app });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        expect(result).toEqual(responseData);
        expect(context.get('response').ok).toBe(true);
    });

    it('should make a successful GET request with object param', async () => {
        const responseData = { data: { nested: { value: 42 } } };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
            path: 'data.nested.value',
        };

        const result = await get(param, { context, app });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        expect(result).toBe(42);
        expect(context.get('response').ok).toBe(true);
    });

    it('should handle placeholders in URL', async () => {
        const responseData = { data: 'test' };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/${id}',
        };

        const testData = {
            id: '123',
            svelteKit: { goto: vi.fn() },
        };
        context.store.set(testData);

        await get(param, { context, app });
        const response = context.get('response');

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/123', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        expect(response.data).toEqual(responseData);
    });

    it('should throw error for unresolved placeholders', async () => {
        const param = {
            url: 'https://api.example.com/${unresolved_id}',
        };
        context.set('data', {
            id: '123',
            svelteKit: { goto: vi.fn() },
        });

        await expect(get(param, { context, app })).rejects.toThrow(
            '[get] operation has unresolved placeholders for param [url]'
        );
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle error with on_error operations', async () => {
        const mockResponse = new Response('{"error": "Not Found"}', {
            status: 400,
            statusText: 'Bad Request',
        });
        mockFetch.mockResolvedValue(mockResponse);

        const logger = vi.spyOn(app['operations'], 'log').mockImplementation(() => null);

        const param = {
            url: 'https://api.example.com/data',
            on_error: [{ log: 'response.statusText' }],
        };

        await expect(get(param, { context, app })).rejects.toThrow();
        expect(logger).toHaveBeenCalled();
    });

    it('should throw error when request fails and no on_error handler', async () => {
        const mockResponse = new Response('{"error": "Not Found"}', {
            status: 400,
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
        };

        await expect(get(param, { context, app })).rejects.toThrow(
            "GET operation for [https://api.example.com/data] failed with status [400] and there's no operations set to handle the error"
        );
    });

    it('throws 404 error from sveltekit on 404 response', async () => {
        const mockResponse = new Response('{"error": "Not Found"}', {
            status: 404,
            statusText: 'Not Found',
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
        };

        try {
            await get(param, { context, app });
            throw 'Expected error to be thrown';
        } catch (err) {
            expect(err).toEqual(
                expect.objectContaining({
                    status: 404,
                    body: {
                        message: 'Not Found',
                    },
                })
            );
        }
    });
});
