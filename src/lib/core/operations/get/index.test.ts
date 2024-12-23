import { expect, describe, it, beforeEach, vi } from 'vitest';
import { get } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import { app } from '@/lib/index.js';
import { installOperations } from '@/lib/core/operations/index.js';

describe('get', () => {
    let context: Context;
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        installOperations(app);
        context = createContext();
        mockFetch = vi.fn();
        context.fetch = mockFetch;
    });

    it('should make a successful GET request with string param', async () => {
        const responseData = { success: true };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        const result = await get('https://api.example.com/data', { context });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
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

        const result = await get(param, { context });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
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

        await get(param, { context });
        const response = context.get('response');

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/123', {
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

        await expect(get(param, { context })).rejects.toThrow(
            '[get] operation has unresolved placeholders for param [url]'
        );
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle error with on_error operations', async () => {
        const mockResponse = new Response('{"error": "Not Found"}', {
            status: 404,
            statusText: 'Not Found',
        });
        mockFetch.mockResolvedValue(mockResponse);

        const logger = vi.spyOn(app['operations'], 'log').mockImplementation(() => null);

        const param = {
            url: 'https://api.example.com/data',
            on_error: [{ log: 'response.statusText' }],
        };

        await expect(get(param, { context })).rejects.toThrow();
        expect(logger).toHaveBeenCalled();
    });

    it('should throw error when request fails and no on_error handler', async () => {
        const mockResponse = new Response('{"error": "Not Found"}', {
            status: 404,
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
        };

        await expect(get(param, { context })).rejects.toThrow(
            "GET operation for [https://api.example.com/data] failed with status [404] and there's no operations set to handle the error"
        );
    });
});
