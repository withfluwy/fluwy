import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from './index.js';

describe('delay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should delay the callback', () => {
        const callback = vi.fn();
        delay(callback, { after: 100 });
        expect(callback).not.toHaveBeenCalled();
        vi.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalled();
    });

    it('should not execute the callback if the condition is false', () => {
        const callback = vi.fn();
        delay(callback, { after: 100, if: () => false });
        expect(callback).not.toHaveBeenCalled();
        vi.advanceTimersByTime(200);
        expect(callback).not.toHaveBeenCalled();
    });
});
