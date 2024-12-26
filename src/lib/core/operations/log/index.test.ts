import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createContext } from '@/lib/core/context/index.js';
import { log } from './index.js';
import { createApp } from '@/lib/index.js';
import type { Application } from '@/lib/core/app/index.js';

describe('log operation', () => {
    let consoleLog: ReturnType<typeof vi.spyOn>;
    let context: ReturnType<typeof createContext>;
    let app: Application;

    beforeEach(() => {
        consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
        context = createContext();
        app = createApp();
    });

    afterEach(() => {
        consoleLog.mockRestore();
    });

    it('should log parameters with console.log', () => {
        // When
        log('test', { context, app });
        // Then
        expect(consoleLog).toHaveBeenCalledWith('test');
    });

    it('compiles the parameters with the given context', () => {
        // Given
        context.set('name', 'John');
        context.set('record', { id: 1 });

        // When
        log('my name is ${name} with ${record.id}', { context, app });

        // Then
        expect(consoleLog).toHaveBeenCalledWith('my name is John with 1');
    });

    it('returns the previous result', () => {
        // Given
        const previousResult = { id: 1 };

        // When
        const newResult = log('test', { context, previousResult, app });

        // Then
        expect(newResult).toEqual(previousResult);
    });
});
