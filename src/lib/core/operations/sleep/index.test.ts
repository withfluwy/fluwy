import { expect, describe, it, vi } from 'vitest';
import { sleep } from './index.js';
import { createContext } from '@/lib/core/context/index.js';
import * as utils from '@/lib/core/utils/index.js';

describe('sleep', () => {
    const context = createContext();
    const previousResult = 'previousResult';

    it('should throw error when duration is not a valid number', async () => {
        await expect(sleep('invalid', context, previousResult)).rejects.toThrow(
            'Invalid parameter for [sleep] operation: invalid'
        );
    });

    it('should sleep for specified duration and return previous result', async () => {
        const sleepSpy = vi.spyOn(utils, 'sleep');
        const duration = '1000';

        const result = await sleep(duration, context, previousResult);

        expect(sleepSpy).toHaveBeenCalledWith(1000);
        expect(result).toBe(previousResult);

        sleepSpy.mockRestore();
    });
});
