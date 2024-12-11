import { describe, it, expect, beforeEach } from 'vitest';
import { HttpResponse } from './index.js';

describe('HttpResponse', () => {
    describe('constructor', () => {
        it('should create an instance with default values', () => {
            const response = new HttpResponse();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe('');
            expect(response.ok).toBe(true);
            expect(response.body).toBeNull();
            expect(response.bodyUsed).toBe(false);
            expect(response.type).toBe('default');
            expect(response.url).toBe('');
            expect(response.redirected).toBe(false);
        });

        it('should create an instance with custom init values', () => {
            const headers = new Headers({ 'Content-Type': 'application/json' });
            const response = new HttpResponse(null, {
                status: 404,
                statusText: 'Not Found',
                headers,
            });

            expect(response.status).toBe(404);
            expect(response.statusText).toBe('Not Found');
            expect(response.ok).toBe(false);
            expect(response.headers.get('Content-Type')).toBe('application/json');
        });

        it('should handle string body', () => {
            const response = new HttpResponse('test body');
            expect(response.body).toBeInstanceOf(ReadableStream);
        });

        it('should handle JSON body', () => {
            const body = JSON.stringify({ test: 'value' });
            const response = new HttpResponse(body);
            expect(response.body).toBeInstanceOf(ReadableStream);
        });
    });

    describe('static fromResponse', () => {
        it('should create a new HttpResponse from an existing Response', async () => {
            const originalResponse = new Response('test body', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'text/plain' },
            });

            const httpResponse = await HttpResponse.fromResponse(originalResponse);
            expect(httpResponse.status).toBe(201);
            expect(httpResponse.statusText).toBe('Created');
            expect(httpResponse.headers.get('Content-Type')).toBe('text/plain');
            expect(await httpResponse.text()).toBe('test body');
        });

        it('should create a new HttpResponse from a text Response', async () => {
            const originalResponse = new Response('test body', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'text/plain' },
            });

            const httpResponse = await HttpResponse.fromResponse(originalResponse);
            expect(httpResponse.status).toBe(201);
            expect(httpResponse.statusText).toBe('Created');
            expect(httpResponse.headers.get('Content-Type')).toBe('text/plain');
            expect(await httpResponse.text()).toBe('test body');
            await expect(httpResponse.asyncJson()).rejects.toThrow('Response is not JSON');
        });

        it('should create a new HttpResponse from a JSON Response', async () => {
            const originalResponse = new Response('{"message": "test"}', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'application/json' },
            });

            const httpResponse = await HttpResponse.fromResponse(originalResponse);
            expect(httpResponse.status).toBe(201);
            expect(httpResponse.statusText).toBe('Created');
            expect(httpResponse.headers.get('Content-Type')).toBe('application/json');
            expect(await httpResponse.asyncJson()).toEqual({ message: 'test' });
        });
    });

    describe('body methods', () => {
        let response: HttpResponse;

        beforeEach(() => {
            response = new HttpResponse('test body');
        });

        it('should read body as text', async () => {
            const text = await response.text();
            expect(text).toBe('test body');
            expect(response.bodyUsed).toBe(true);
        });

        it('should read body as JSON', async () => {
            const testData = { test: 'value' };
            const jsonResponse = new HttpResponse(JSON.stringify(testData), {
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await jsonResponse.asyncJson();
            expect(json).toEqual(testData);
            expect(jsonResponse.bodyUsed).toBe(true);
        });

        it('should read body as ArrayBuffer', async () => {
            const buffer = await response.arrayBuffer();
            expect(buffer).toBeInstanceOf(ArrayBuffer);
            const text = new TextDecoder().decode(buffer);
            expect(text).toBe('test body');
        });

        it('should read body as Blob', async () => {
            const blob = await response.blob();
            expect(blob.type).toBe('text/plain;charset=utf-8');
            expect(blob.size).toBeGreaterThan(0);
        });

        it('should throw error when body is already read', async () => {
            await response.text();
            await expect(response.text()).rejects.toThrow('Body has already been');
        });
    });

    describe('json()', () => {
        it('should parse and cache JSON response', async () => {
            const testData = { message: 'test' };
            const response = new HttpResponse(JSON.stringify(testData), {
                headers: { 'Content-Type': 'application/json' },
            });

            const result1 = await response.asyncJson();
            expect(result1).toEqual(testData);

            // Second call should return cached result
            const result2 = await response.asyncJson();
            expect(result2).toEqual(testData);
            expect(result2).toBe(result1); // Should be the same object reference
        });

        it('should handle invalid JSON', async () => {
            const response = new HttpResponse('invalid json', {
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(response.asyncJson()).rejects.toThrow();
        });
    });

    describe('clone', () => {
        it('should create a clone of the response', () => {
            const original = new HttpResponse('test', {
                status: 201,
                statusText: 'Created',
                headers: { 'Content-Type': 'text/plain' },
            });

            const clone = original.clone();
            expect(clone.status).toBe(201);
            expect(clone.statusText).toBe('Created');
            expect(clone.headers.get('Content-Type')).toBe('text/plain');
        });

        it('should throw error when cloning used response', async () => {
            const response = new HttpResponse('test');
            await response.text();
            expect(() => response.clone()).toThrow('Body has already been consumed');
        });
    });

    describe('formData', () => {
        it('should parse form data from body', async () => {
            const formBody = 'name=test&value=123';
            const response = new HttpResponse(formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const formData = await response.formData();

            expect(formData.get('name')).toBe('test');
            expect(formData.get('value')).toBe('123');
        });
    });

    describe('json', () => {
        it('allows call json method multiple times without error', async () => {
            const response = new HttpResponse(JSON.stringify({ test: 'value' }), {
                headers: { 'Content-Type': 'application/json' },
            });

            expect(await response.asyncJson()).toEqual({ test: 'value' });
            expect(await response.asyncJson()).toEqual({ test: 'value' });
        });
    });
});
