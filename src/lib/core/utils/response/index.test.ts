import { describe, it, expect } from 'vitest';
import { buildHttpResponse } from './index.js';

describe('HttpResponse', () => {
    describe('static fromResponse', () => {
        it('should create an IHttpResponse from a text Response', async () => {
            const originalResponse = new Response('test body', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'text/plain' },
            });

            const httpResponse = await buildHttpResponse(originalResponse);
            expect(httpResponse.status).toBe(201);
            expect(httpResponse.statusText).toBe('Created');
            expect(httpResponse.headers.get('Content-Type')).toBe('text/plain');
            expect(httpResponse.text).toBe('test body');
            expect(httpResponse.data).toBeUndefined();
            expect(httpResponse.ok).toBe(true);
            expect(httpResponse.type).toBe('default');
            expect(httpResponse.url).toBe('');
            expect(httpResponse.redirected).toBe(false);
        });

        it('should create an IHttpResponse from a JSON Response', async () => {
            const originalResponse = new Response('{"message": "test"}', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'application/json' },
            });

            const httpResponse = await buildHttpResponse(originalResponse);
            expect(httpResponse.status).toBe(201);
            expect(httpResponse.statusText).toBe('Created');
            expect(httpResponse.headers.get('Content-Type')).toBe('application/json');
            expect(httpResponse.data).toEqual({ message: 'test' });
            expect(httpResponse.text).toBeUndefined();
            expect(httpResponse.ok).toBe(true);
            expect(httpResponse.type).toBe('default');
            expect(httpResponse.url).toBe('');
            expect(httpResponse.redirected).toBe(false);
        });
    });
});
