import { expect, describe, it, vi, beforeEach } from 'vitest';
import { sleep } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import * as utils from '@/lib/core/utils/index.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';

describe('sleep', () => {
    const context = createContext();
    const previousResult = 'previousResult';
    let app: Application;

    beforeEach(() => {
        app = createApp();
    });

    it('should throw error when duration is not a valid number', async () => {
        await expect(sleep('invalid', { context, previousResult, app })).rejects.toThrow(
            'Invalid parameter for [sleep] operation: invalid'
        );
    });

    it('should sleep for specified duration and return previous result', async () => {
        const sleepSpy = vi.spyOn(utils, 'sleep').mockResolvedValue(Promise.resolve());
        const duration = '1000';

        const result = await sleep(duration, { context, previousResult, app });

        expect(sleepSpy).toHaveBeenCalledWith(1000);
        expect(result).toBe(previousResult);

        sleepSpy.mockRestore();
    });
});
