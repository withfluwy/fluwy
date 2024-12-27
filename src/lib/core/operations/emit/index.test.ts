import { expect, describe, it, beforeEach, vi } from 'vitest';
import { emit } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import type { Any } from '@/lib/core/contracts.js';
import { Events } from '@/lib/core/utils/events/index.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';

describe('emit', () => {
    let context: Context;
    let previousResult: Any;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        previousResult = 'previousResult';
        app = createApp();
        vi.spyOn(Events, 'emit');
    });

    it('requires a filled string or object with event and payload', async () => {
        await expect(emit('', { context, previousResult, app })).rejects.toThrow('Event name is required');
        await expect(emit(null, { context, previousResult, app })).rejects.toThrow('Event name is required');
        await expect(emit(undefined, { context, previousResult, app })).rejects.toThrow('Event name is required');
        await expect(emit({ event: '' }, { context, previousResult, app })).rejects.toThrow('Event name is required');
        await expect(emit({ event: 'working' }, { context, previousResult, app })).resolves.toBe(previousResult);
    });

    it('should emit an event', async () => {
        const result = await emit('test', { context, previousResult, app });
        expect(result).toBe(previousResult);
        expect(Events.emit).toHaveBeenCalledWith('test');
    });

    it('should emit an event with payload', async () => {
        const result = await emit({ event: 'test', payload: 'payload' }, { context, previousResult, app });
        expect(result).toBe(previousResult);
        expect(Events.emit).toHaveBeenCalledWith('test', 'payload');
    });
});
