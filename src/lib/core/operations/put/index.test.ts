import { describe, it, expect, vi, beforeEach } from 'vitest';
import { put } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import type { Context } from '@/lib/core/context/index.js';
import { AbortOperationError } from '@/lib/index.js';
import { createApp } from '@/lib/index.js';
import type { Application } from '@/lib/core/app/index.js';

describe('put', () => {
    let context: Context;
    let app: Application;
    const mockFetch = vi.fn();

    beforeEach(() => {
        context = createContext();
        app = createApp();
        global.fetch = mockFetch;
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
            { context, app }
        );

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/resource/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'value' }),
            credentials: 'include',
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
                { context, app }
            )
        ).rejects.toThrow(AbortOperationError);

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
                { context, app }
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
                { context, app }
            )
        ).rejects.toThrow('[put] operation has unresolved placeholders for param [url]');
    });

    it('should use auth token if its provided', async () => {
        // Given
        const mockResponse = new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        mockFetch.mockResolvedValue(mockResponse);

        context.set('auth_token', 'token');
        context.set('form', {
            data: { key: 'value' },
        });

        // When
        await put(
            {
                url: 'https://api.example.com/resource/1',
                data: 'form.data',
            },
            { context, app }
        );

        // Then
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/resource/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
            body: JSON.stringify({ key: 'value' }),
            credentials: 'include',
        });
    });
});
