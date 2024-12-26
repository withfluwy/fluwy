import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './index.js';
import * as getOperationModule from '@/lib/core/operations/get/index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import { createApp } from '@/lib/index.js';
import type { Application } from '@/lib/core/app/index.js';

describe('load operation', () => {
    let context: Context;
    let app: Application;

    beforeEach(() => {
        app = createApp();
        context = createContext();
    });

    it('should load multiple values and set them in context', async () => {
        const mockGet = vi.spyOn(getOperationModule, 'get');
        mockGet.mockImplementation(async (param) => `value-${param}`);

        const params = {
            var1: 'http://localhost:3000/resource1',
            var2: 'http://localhost:3000/resource2',
        };

        await load(params, { context, app });

        expect(mockGet).toHaveBeenCalledTimes(2);
        expect(mockGet).toHaveBeenCalledWith('http://localhost:3000/resource1', { context, app });
        expect(mockGet).toHaveBeenCalledWith('http://localhost:3000/resource2', { context, app });
        expect(context.get('var1')).toBe('value-http://localhost:3000/resource1');
        expect(context.get('var2')).toBe('value-http://localhost:3000/resource2');
    });

    it('should throw error when params is not provided', async () => {
        await expect(load(undefined, { context, app })).rejects.toThrow(
            'Load operation requires parameters but none were provided'
        );
    });

    it('should handle empty params object', async () => {
        const mockGet = vi.spyOn(getOperationModule, 'get');

        await load({}, { context, app });

        expect(mockGet).not.toHaveBeenCalled();
    });

    it('should handle get operation errors', async () => {
        const mockGet = vi.spyOn(getOperationModule, 'get');
        const error = new Error('Get operation failed');
        mockGet.mockRejectedValue(error);

        const params = {
            var1: 'param1',
        };

        await expect(load(params, { context, app })).rejects.toThrow('Get operation failed');
    });
});
