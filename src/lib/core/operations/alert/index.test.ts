import { describe, expect, it, vi } from 'vitest';
import { createContext } from '@/lib/core/context/index.js';
import { alert as alertOperation } from './index.js';
import { createApp } from '@/lib/index.js';

describe('alert operation', () => {
    it('should call window.alert with compiled message', async () => {
        const app = createApp();
        const window = globalThis;
        window.alert = vi.fn();
        const context = createContext();
        const previousResult = 1;
        context.set('record', { name: 'John' });

        const result = await alertOperation('Welcome ${record.name}', { context, previousResult, app });
        expect(window.alert).toHaveBeenCalledWith('Welcome John');
        expect(result).toBe(previousResult);
    });
});
