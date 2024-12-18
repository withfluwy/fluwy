import { describe, it, expect, vi, beforeEach } from 'vitest';
import { put } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import type { Context } from '@/lib/core/context/index.js';
import { app } from '@/lib/index.js';
import { AbortOperation } from '@/lib/core/operations/utils.js';

describe('put', () => {
    let context: Context;
    const mockFetch = vi.fn();

    beforeEach(() => {
        context = createContext();
        context.fetch = mockFetch;
        mockFetch.mockReset();
        vi.spyOn(app, 'handleOperations').mockImplementation(() => Promise.resolve());
    });

    it('should make PUT request and handle successful response', async () => {
        const responseData = { success: true };
        const mockResponse = new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        context.set('form', {
            data: { key: 'value' },
        });

        const result = await put(
            {
                url: 'https://api.example.com/resource/1',
                data: 'form.data',
            },
            { context }
        );

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/resource/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'value' }),
        });
        expect(result.data).toEqual(responseData);
        expect(result.ok).toBe(true);
        expect(context.get('response')).toBe(result);
    });

    it('should handle error response and execute on_error operations', async () => {
        const errorResponse = new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(errorResponse);

        const mockOperations = { execute: vi.fn() };

        await expect(
            put(
                {
                    url: 'https://api.example.com/resource/1',
                    data: 'form.data',
                    on_error: mockOperations,
                },
                { context }
            )
        ).rejects.toThrow(AbortOperation);

        expect(app.handleOperations).toHaveBeenCalledWith(mockOperations, context, 'form.data');
    });

    it('should throw error when no error handler is provided', async () => {
        const errorResponse = new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(errorResponse);

        await expect(
            put(
                {
                    url: 'https://api.example.com/resource/1',
                    data: 'form.data',
                },
                { context }
            )
        ).rejects.toThrow('PUT operation for [https://api.example.com/resource/1] failed with status [404]');
    });

    it('should throw error if URL contains unresolved placeholders', async () => {
        await expect(
            put(
                {
                    url: 'https://api.example.com/${id}',
                    data: 'form.data',
                },
                { context }
            )
        ).rejects.toThrow('[put] operation has unresolved placeholders for param [url]');
    });
});
