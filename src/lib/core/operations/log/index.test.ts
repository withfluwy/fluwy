import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createContext } from '@/lib/core/context/index.js';
import { log } from './index.js';

describe('log operation', () => {
    let consoleLog: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLog.mockRestore();
    });

    it('should log parameters with console.log', () => {
        // Given
        const context = createContext();

        // When
        log('test', context);

        // Then
        expect(consoleLog).toHaveBeenCalledWith('test');
    });

    it('compiles the parameters with the given context', () => {
        // Given
        const context = createContext();
        context.set('name', 'John');
        context.set('record', { id: 1 });

        // When
        log('my name is ${name} with ${record.id}', context);

        // Then
        expect(consoleLog).toHaveBeenCalledWith('my name is John with 1');
    });

    it('returns the previous result', () => {
        // Given
        const context = createContext();
        const previousResult = { id: 1 };

        // When
        const newResult = log('test', context, previousResult);

        // Then
        expect(newResult).toEqual(previousResult);
    });
});
