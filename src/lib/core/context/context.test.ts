import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import * as svelteContext from 'svelte';
import { createContext, setupContext, useContext, type Context } from './index.js';
import { goto } from '$app/navigation';

// Mock Svelte's context functions
vi.mock('svelte', async () => {
    const actual = await vi.importActual('svelte');
    return {
        ...actual,
        getContext: vi.fn(),
        setContext: vi.fn(),
    };
});

// Mock SvelteKit's navigation
vi.mock('$app/navigation', () => ({
    goto: vi.fn(),
}));

describe('Context Module', () => {
    let mockContext: Context;

    beforeEach(() => {
        vi.resetAllMocks();
        mockContext = createContext({ testKey: 'testValue' });
        vi.mocked(svelteContext.getContext).mockReturnValue(mockContext);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('createContext', () => {
        it('creates a context with initial data', () => {
            const ctx = createContext({ foo: 'bar' });

            expect(ctx).toBeDefined();
            expect(ctx.data).toEqual({
                svelteKit: { goto },
                foo: 'bar',
            });
        });

        it('creates a context with default values when no initial data is provided', () => {
            const ctx = createContext();

            expect(ctx).toBeDefined();
            expect(ctx.data).toEqual({
                svelteKit: { goto },
            });
        });

        it('creates a context with a store', () => {
            const ctx = createContext();

            expect(ctx.store).toBeDefined();
            expect(typeof ctx.store.subscribe).toBe('function');
        });
    });

    describe('setupContext', () => {
        it('sets context using Svelte setContext', () => {
            setupContext(mockContext);

            expect(svelteContext.setContext).toHaveBeenCalledWith(expect.any(Symbol), mockContext);
        });
    });

    describe('useContext', () => {
        it('gets context using Svelte getContext', () => {
            const result = useContext();

            expect(svelteContext.getContext).toHaveBeenCalledWith(expect.any(Symbol));
            expect(result).toBe(mockContext);
        });
    });

    describe('Context methods', () => {
        let context: Context;

        beforeEach(() => {
            context = createContext({ initial: 'value' });
        });

        it('get method returns the value for a given key', () => {
            expect(context.get('initial')).toBe('value');
        });

        it('set method updates the context with a new key-value pair', () => {
            context.set('newKey', 'newValue');

            expect(context.get('newKey')).toBe('newValue');
            expect(context.data.newKey).toBe('newValue');
        });

        it('set method updates the store', () => {
            const storeSpy = vi.spyOn(context.store, 'update');

            context.set('anotherKey', 'anotherValue');

            expect(storeSpy).toHaveBeenCalled();
            expect(get(context.store).anotherKey).toBe('anotherValue');
        });

        it('data getter returns the current store value', () => {
            const initialData = context.data;

            context.set('foo', 'bar');

            expect(context.data).not.toEqual(initialData);
            expect(context.data.foo).toBe('bar');
        });
    });

    describe('cloneWith method', () => {
        let originalContext: Context;

        beforeEach(() => {
            originalContext = createContext({
                userId: 123,
                profile: {
                    name: 'John',
                    email: 'john@example.com',
                    settings: {
                        theme: 'dark',
                        notifications: true,
                    },
                },
            });
        });

        it('creates a new context instance', () => {
            const newContext = originalContext.cloneWith({ newValue: 'test' });

            expect(newContext).not.toBe(originalContext);
            expect(newContext.store).not.toBe(originalContext.store);
        });

        it('includes all original data', () => {
            const newContext = originalContext.cloneWith({ newValue: 'test' });

            expect(newContext.get('userId')).toBe(123);
            expect(newContext.get('profile')).toEqual(originalContext.get('profile'));
            expect(newContext.get('svelteKit')).toBeDefined();
        });

        it('adds new data', () => {
            const newContext = originalContext.cloneWith({ newValue: 'test' });

            expect(newContext.get('newValue')).toBe('test');
        });

        it('overrides existing data', () => {
            const newContext = originalContext.cloneWith({
                userId: 456,
                profile: {
                    name: 'Jane',
                    email: 'jane@example.com',
                },
            });

            expect(newContext.get('userId')).toBe(456);
            expect(newContext.get('profile')).toEqual({
                name: 'Jane',
                email: 'jane@example.com',
            });
        });

        it('creates a deep copy of the data (immutability)', () => {
            const newContext = originalContext.cloneWith({ newValue: 'test' });

            // Modify original context
            originalContext.set('userId', 999);

            // The new context should not be affected
            expect(newContext.get('userId')).toBe(123);

            // Modify new context
            newContext.set('anotherValue', 'another test');

            // The original context should not be affected
            expect(originalContext.get('anotherValue')).toBeUndefined();
        });

        it('correctly handles arrays and maintains array immutability', () => {
            // Setup original context with arrays
            const contextWithArrays = createContext({
                items: [1, 2, 3],
                users: [
                    { id: 1, name: 'Alice' },
                    { id: 2, name: 'Bob' },
                ],
                nestedArrays: [
                    [1, 2],
                    [3, 4],
                ],
            });

            // Create clone with additional data
            const newContext = contextWithArrays.cloneWith({
                newItems: ['a', 'b', 'c'],
            });

            // Test 1: Verify arrays are correctly copied
            expect(newContext.get('items')).toEqual([1, 2, 3]);
            expect(newContext.get('users')).toEqual([
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
            ]);
            expect(newContext.get('nestedArrays')).toEqual([
                [1, 2],
                [3, 4],
            ]);
            expect(newContext.get('newItems')).toEqual(['a', 'b', 'c']);

            // Test 2: Modify arrays in original context
            contextWithArrays.get('items').push(4);
            contextWithArrays.get('users')[0].name = 'Alicia';
            contextWithArrays.get('nestedArrays')[0][0] = 99;

            // Cloned arrays should remain unchanged
            expect(newContext.get('items')).toEqual([1, 2, 3]);
            expect(newContext.get('users')[0].name).toBe('Alice');
            expect(newContext.get('nestedArrays')[0][0]).toBe(1);

            // Test 3: Modify arrays in new context
            newContext.get('items').push(5);
            newContext.get('users')[1].name = 'Bobby';
            newContext.get('nestedArrays')[1][1] = 88;

            // Original arrays should remain unchanged
            expect(contextWithArrays.get('items').length).toBe(4); // [1,2,3,4] from our earlier modification
            expect(contextWithArrays.get('items')).not.toContain(5);
            expect(contextWithArrays.get('users')[1].name).toBe('Bob');
            expect(contextWithArrays.get('nestedArrays')[1][1]).toBe(4);
        });
    });
});
