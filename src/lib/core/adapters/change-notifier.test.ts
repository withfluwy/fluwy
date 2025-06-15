import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangeNotifier } from './change-notifier.js';

describe('ChangeNotifier', () => {
    let changeNotifier: ChangeNotifier;

    beforeEach(() => {
        changeNotifier = new ChangeNotifier();
    });

    describe('onChange', () => {
        it('should add a listener to the listeners set', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            
            // Verify the listener was added by checking if it gets called when notifying
            changeNotifier.notifyChanges();
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should add multiple different listeners', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            
            changeNotifier.onChange(callback1);
            changeNotifier.onChange(callback2);
            
            changeNotifier.notifyChanges();
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
        });

        it('should not add the same listener twice', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.onChange(callback); // Add same callback again
            
            changeNotifier.notifyChanges();
            // Should only be called once since Set prevents duplicates
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('removeListener', () => {
        it('should remove an existing listener', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.removeListener(callback);
            
            changeNotifier.notifyChanges();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should not throw error when removing non-existent listener', () => {
            const callback = vi.fn();
            
            expect(() => {
                changeNotifier.removeListener(callback);
            }).not.toThrow();
        });

        it('should only remove the specified listener', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            
            changeNotifier.onChange(callback1);
            changeNotifier.onChange(callback2);
            changeNotifier.removeListener(callback1);
            
            changeNotifier.notifyChanges();
            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalledTimes(1);
        });

        it('should handle removing the same listener multiple times', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.removeListener(callback);
            changeNotifier.removeListener(callback); // Remove again
            
            expect(() => {
                changeNotifier.notifyChanges();
            }).not.toThrow();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('notifyChanges', () => {
        it('should call all registered listeners', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            const callback3 = vi.fn();
            
            changeNotifier.onChange(callback1);
            changeNotifier.onChange(callback2);
            changeNotifier.onChange(callback3);
            
            changeNotifier.notifyChanges();
            
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
            expect(callback3).toHaveBeenCalledTimes(1);
        });

        it('should pass arguments to all listeners', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            
            changeNotifier.onChange(callback1);
            changeNotifier.onChange(callback2);
            
            const arg1 = 'test';
            const arg2 = { data: 'value' };
            const arg3 = 42;
            
            changeNotifier.notifyChanges(arg1, arg2, arg3);
            
            expect(callback1).toHaveBeenCalledWith(arg1, arg2, arg3);
            expect(callback2).toHaveBeenCalledWith(arg1, arg2, arg3);
        });

        it('should work with no arguments', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.notifyChanges();
            
            expect(callback).toHaveBeenCalledWith();
        });

        it('should work with single argument', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.notifyChanges('single-arg');
            
            expect(callback).toHaveBeenCalledWith('single-arg');
        });

        it('should work with multiple arguments of different types', () => {
            const callback = vi.fn();
            
            changeNotifier.onChange(callback);
            changeNotifier.notifyChanges(
                'string',
                123,
                true,
                { key: 'value' },
                [1, 2, 3],
                null,
                undefined
            );
            
            expect(callback).toHaveBeenCalledWith(
                'string',
                123,
                true,
                { key: 'value' },
                [1, 2, 3],
                null,
                undefined
            );
        });

        it('should not throw error when no listeners are registered', () => {
            expect(() => {
                changeNotifier.notifyChanges('test');
            }).not.toThrow();
        });

        it('should handle listener that throws an error', () => {
            const goodCallback = vi.fn();
            const badCallback = vi.fn(() => {
                throw new Error('Listener error');
            });
            const anotherGoodCallback = vi.fn();
            
            changeNotifier.onChange(goodCallback);
            changeNotifier.onChange(badCallback);
            changeNotifier.onChange(anotherGoodCallback);
            
            // The error should propagate, but we can test that other listeners still get called
            // by catching the error
            expect(() => {
                changeNotifier.notifyChanges();
            }).toThrow('Listener error');
            
            expect(goodCallback).toHaveBeenCalledTimes(1);
            expect(badCallback).toHaveBeenCalledTimes(1);
            // Note: anotherGoodCallback might not be called if badCallback throws first
            // This depends on the iteration order of the Set
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex add/remove/notify workflow', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            const callback3 = vi.fn();
            
            // Add listeners
            changeNotifier.onChange(callback1);
            changeNotifier.onChange(callback2);
            
            // First notification
            changeNotifier.notifyChanges('first');
            expect(callback1).toHaveBeenCalledWith('first');
            expect(callback2).toHaveBeenCalledWith('first');
            expect(callback3).not.toHaveBeenCalled();
            
            // Add another listener
            changeNotifier.onChange(callback3);
            
            // Second notification
            changeNotifier.notifyChanges('second');
            expect(callback1).toHaveBeenCalledWith('second');
            expect(callback2).toHaveBeenCalledWith('second');
            expect(callback3).toHaveBeenCalledWith('second');
            
            // Remove one listener
            changeNotifier.removeListener(callback2);
            
            // Third notification
            changeNotifier.notifyChanges('third');
            expect(callback1).toHaveBeenCalledWith('third');
            expect(callback3).toHaveBeenCalledWith('third');
            
            // Verify callback2 was not called for the third notification
            expect(callback2).toHaveBeenCalledTimes(2); // Only first and second calls
        });

        it('should maintain listener state across multiple instances', () => {
            const notifier1 = new ChangeNotifier();
            const notifier2 = new ChangeNotifier();
            
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            
            notifier1.onChange(callback1);
            notifier2.onChange(callback2);
            
            notifier1.notifyChanges('notifier1');
            notifier2.notifyChanges('notifier2');
            
            expect(callback1).toHaveBeenCalledWith('notifier1');
            expect(callback1).not.toHaveBeenCalledWith('notifier2');
            expect(callback2).toHaveBeenCalledWith('notifier2');
            expect(callback2).not.toHaveBeenCalledWith('notifier1');
        });
    });
});
