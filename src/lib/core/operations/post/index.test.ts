import { expect, describe, it, beforeEach, vi } from 'vitest';
import { post } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import { HttpResponse } from '@/lib/core/utils/response/index.js';
import { app } from '@/lib/index.js';

describe('post', () => {
    let context: Context;
    let mockFetch: ReturnType<typeof vi.fn>;
    let mockHandleOperations: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        context = createContext();
        mockFetch = vi.fn();
        mockHandleOperations = vi.fn();
        context.fetch = mockFetch;
        vi.spyOn(app, 'handleOperations').mockImplementation(mockHandleOperations);
    });

    it('should make a successful POST request', async () => {
        const responseData = { success: true };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
            data: 'data.request',
        };

        context.set('data', {
            request: { key: 'value' },
            svelteKit: { goto: vi.fn() },
        });

        const result = await post(param, { context });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
        });
        expect(result).toBeInstanceOf(HttpResponse);
        expect(result.ok).toBe(true);
        expect(context.get('response')).toBe(result);
    });

    it('should handle placeholders in URL', async () => {
        const mockResponse = new Response('{}', { status: 200 });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/${id}',
            data: 'request',
        };

        const testData = {
            id: '123',
            request: { key: 'value' },
            svelteKit: { goto: vi.fn() },
        };
        context.store.set(testData);

        const result = await post(param, { context });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/123', {
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
        });
        expect(result.ok).toBe(true);
    });

    it('should throw error for unresolved placeholders', async () => {
        const param = {
            url: 'https://api.example.com/${unresolved_id}',
            data: 'data.request',
        };
        context.set('data', {
            id: '123',
            request: { key: 'value' },
            svelteKit: { goto: vi.fn() },
        });

        await expect(post(param, { context })).rejects.toThrow(
            '[post] operation has unresolved placeholders for param [url]'
        );
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle error with on_error operations', async () => {
        const mockResponse = new Response('{"error": "Bad Request"}', {
            status: 400,
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
            data: 'data.request',
            on_error: [{ type: 'some_error_handler' }],
        };
        context.set('data', {
            request: { key: 'value' },
            svelteKit: { goto: vi.fn() },
        });

        await expect(post(param, { context })).rejects.toThrow();
        expect(mockHandleOperations).toHaveBeenCalledWith(param.on_error, context, { key: 'value' });
    });

    it('should throw error when request fails without on_error handler', async () => {
        const mockResponse = new Response('{"error": "Bad Request"}', {
            status: 400,
        });
        mockFetch.mockResolvedValue(mockResponse);

        const param = {
            url: 'https://api.example.com/data',
            data: 'data.request',
        };
        context.set('data', {
            request: { key: 'value' },
            svelteKit: { goto: vi.fn() },
        });

        await expect(post(param, { context })).rejects.toThrow(
            "POST operation for [https://api.example.com/data] failed with status [400] and there's no operations set to handle the error"
        );
    });
});
