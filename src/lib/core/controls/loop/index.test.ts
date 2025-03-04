import { createContext } from '@/lib/core/context/index.js';
import type { Any, Template } from '@/lib/core/contracts.js';
import { loop_expression } from '@/lib/core/controls/loop/index.js';
import type { LoopItem } from '@/lib/core/controls/loop/types.js';
import { describe, expect, it, test } from 'vitest';

describe('loop controls', () => {
    const context = createContext({
        items: ['a', 'b', 'c'],
        numbers: [1, 2, 3, 4, 5],
        users: [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
        ],
        count: 3,
        person: {
            name: 'Charlie',
            age: 35,
            city: 'San Francisco',
        },
    });

    describe('.check', () => {
        it('returns true for valid loop expressions', () => {
            expect(loop_expression.check('for item of items')).toBe(true);
            expect(loop_expression.check('each item of items')).toBe(true);
            expect(loop_expression.check('3 times do')).toBe(true);
            expect(loop_expression.check('count times do')).toBe(true);
            expect(loop_expression.check('for n of 1..3')).toBe(true);
            expect(loop_expression.check('for n of 3...6')).toBe(true);
            expect(loop_expression.check('for key in object')).toBe(true);
        });

        it('returns false for invalid expressions', () => {
            expect(loop_expression.check('item in items')).toBe(false);
            expect(loop_expression.check('times do')).toBe(false);
            expect(loop_expression.check('3 times')).toBe(false);
            // Invalid range expressions
            expect(loop_expression.check('for n of 1.3')).toBe(false);
            expect(loop_expression.check('for n of 1.3..3')).toBe(false);
            expect(loop_expression.check('for n of 1..3.2')).toBe(false);
            expect(loop_expression.check('for n of 1.5...48')).toBe(false);
            expect(loop_expression.check('for n of 1.5...42.6')).toBe(false);
            expect(loop_expression.check('for n of 1...3.2')).toBe(false);
            // Range expressions must use 'of'
            expect(loop_expression.check('for n in 1..3')).toBe(false);
            expect(loop_expression.check('for n in 1...4')).toBe(false);
            // There's no way to know if an object iteration is an array or not during check
            expect(loop_expression.check('for item in items')).toBe(true);
            expect(loop_expression.check('each item in items')).toBe(true);
        });
    });

    describe('.evaluate array iteration', () => {
        it('returns an array generator', () => {
            const result = loop_expression.evaluate(
                {
                    'for item of items': { text: 'Item: ${item}' },
                },
                context
            );
            // Check if result is a generator by verifying it has the required methods
            expect(typeof result.next).toBe('function');
            expect(typeof result.return).toBe('function');
            expect(typeof result.throw).toBe('function');
            expect(typeof result[Symbol.iterator]).toBe('function');
        });

        it('returns item name and array for "of" syntax', () => {
            const result = loop_expression.evaluate(
                {
                    'for item of items': { text: 'Item: ${item}' },
                },
                context
            );
            const items = Array.from(result);
            // Check that they have the expected structure
            expect(items.length).toBe(3);
            expect(items[0]).toHaveProperty('template');
            expect(items[0]).toHaveProperty('context');
            expect(items[0].template).toEqual({ text: 'Item: a' });
            expect(items[0].context).toHaveProperty('item', 'a');
            expect(items[1].template).toEqual({ text: 'Item: b' });
            expect(items[2].template).toEqual({ text: 'Item: c' });
        });

        it('supports "each" alias for "of" syntax', () => {
            const result = loop_expression.evaluate({ 'each item of items': { text: 'Item: ${item}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Item: a' });
            expect(items[1].template).toEqual({ text: 'Item: b' });
            expect(items[2].template).toEqual({ text: 'Item: c' });
        });

        it('supports templates as objects', () => {
            const result = loop_expression.evaluate(
                { 'for item of items': { h1: 'Title ${item}', mycomponent: 'Item: ${item}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ h1: 'Title a', mycomponent: 'Item: a' });
            expect(items[1].template).toEqual({ h1: 'Title b', mycomponent: 'Item: b' });
            expect(items[2].template).toEqual({ h1: 'Title c', mycomponent: 'Item: c' });
        });

        it('supports templates as arrays', () => {
            const result = loop_expression.evaluate(
                { 'for item of items': [{ h1: 'Title ${item}' }, { text: 'Item: ${item}' }] },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(6); // 3 items × 2 templates

            // Verify the template values
            expect(items[0].template).toEqual({ h1: 'Title a' });
            expect(items[1].template).toEqual({ text: 'Item: a' });
            expect(items[2].template).toEqual({ h1: 'Title b' });
            expect(items[3].template).toEqual({ text: 'Item: b' });
            expect(items[4].template).toEqual({ h1: 'Title c' });
            expect(items[5].template).toEqual({ text: 'Item: c' });

            // Verify context values
            expect(items[0].context).toHaveProperty('item', 'a');
            expect(items[1].context).toHaveProperty('item', 'a');
            expect(items[2].context).toHaveProperty('item', 'b');
            expect(items[3].context).toHaveProperty('item', 'b');
            expect(items[4].context).toHaveProperty('item', 'c');
            expect(items[5].context).toHaveProperty('item', 'c');
        });

        it('throws on invalid syntax', () => {
            expect(() => loop_expression.evaluate({ 'for item items': { text: 'Item: ${item}' } }, context)).toThrow(
                'Invalid for loop syntax'
            );
        });

        it('throws on non-existent iterable', () => {
            expect(() =>
                loop_expression.evaluate({ 'for item of missing': { text: 'Item: ${item}' } }, context)
            ).toThrow("Iterable 'missing' not found in context");
        });

        it('throws on non-array iterable', () => {
            const badContext = createContext({ items: 'not an array' });
            expect(() =>
                loop_expression.evaluate({ 'for item of items': { text: 'Item: ${item}' } }, badContext)
            ).toThrow("'items' is not an array");
        });
    });

    describe('.evaluate object property iteration', () => {
        it('iterates over object properties', () => {
            const result = loop_expression.evaluate(
                { 'for key in person': { text: '${key}: ${person[key]}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'name: Charlie' });
            expect(items[1].template).toEqual({ text: 'age: 35' });
            expect(items[2].template).toEqual({ text: 'city: San Francisco' });
            expect(items[0].context).toHaveProperty('key', 'name');
            expect(items[1].context).toHaveProperty('key', 'age');
            expect(items[2].context).toHaveProperty('key', 'city');
        });

        it('supports property-only iteration', () => {
            const result = loop_expression.evaluate({ 'for key in person': { text: 'Property: ${key}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Property: name' });
            expect(items[1].template).toEqual({ text: 'Property: age' });
            expect(items[2].template).toEqual({ text: 'Property: city' });
        });

        it('supports "each" alias', () => {
            const result = loop_expression.evaluate({ 'each prop in person': { text: '${prop}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'name' });
            expect(items[1].template).toEqual({ text: 'age' });
            expect(items[2].template).toEqual({ text: 'city' });
        });

        it('throws on non-object values', () => {
            const badContext = createContext({ notAnObject: 42 });
            expect(() =>
                loop_expression.evaluate({ 'for key in notAnObject': { text: '${key}' } }, badContext)
            ).toThrow('not an object');
        });

        it('supports index with "with" keyword', () => {
            const result = loop_expression.evaluate(
                { 'for key in person with i': { text: '${i}. ${key}: ${person[key]}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: '0. name: Charlie' });
            expect(items[1].template).toEqual({ text: '1. age: 35' });
            expect(items[2].template).toEqual({ text: '2. city: San Francisco' });
            expect(items[0].context).toHaveProperty('i', 0);
            expect(items[0].context).toHaveProperty('key', 'name');
            expect(items[1].context).toHaveProperty('i', 1);
            expect(items[2].context).toHaveProperty('i', 2);
        });
    });

    describe('.evaluate times loop', () => {
        it('evaluates literal number', () => {
            const result = loop_expression.evaluate({ '3 times do': { text: 'Iteration' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Iteration' });
            expect(items[1].template).toEqual({ text: 'Iteration' });
            expect(items[2].template).toEqual({ text: 'Iteration' });
        });

        it('evaluates context variable', () => {
            const result = loop_expression.evaluate({ 'count times do': { text: 'Iteration' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Iteration' });
            expect(items[1].template).toEqual({ text: 'Iteration' });
            expect(items[2].template).toEqual({ text: 'Iteration' });
        });

        it('supports iteration variable with "with" syntax', () => {
            const result = loop_expression.evaluate({ '3 times with n do': { text: 'Item ${n}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Item 1' });
            expect(items[1].template).toEqual({ text: 'Item 2' });
            expect(items[2].template).toEqual({ text: 'Item 3' });
            expect(items[0].context).toHaveProperty('n', 1);
            expect(items[1].context).toHaveProperty('n', 2);
            expect(items[2].context).toHaveProperty('n', 3);
        });

        it('supports context variable with "with" syntax', () => {
            const result = loop_expression.evaluate({ 'count times with i do': { text: 'Count ${i}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Count 1' });
            expect(items[1].template).toEqual({ text: 'Count 2' });
            expect(items[2].template).toEqual({ text: 'Count 3' });
            expect(items[0].context).toHaveProperty('i', 1);
            expect(items[1].context).toHaveProperty('i', 2);
            expect(items[2].context).toHaveProperty('i', 3);
        });

        it('validates "with" syntax', () => {
            expect(loop_expression.check('3 times with n do')).toBe(true);
            expect(loop_expression.check('count times with index do')).toBe(true);
            expect(loop_expression.check('3 times with')).toBe(false);
            expect(loop_expression.check('3 times with do')).toBe(false);
            expect(loop_expression.check('3 times n with do')).toBe(false);
        });

        it('throws on non-integer values', () => {
            const badContext = createContext({ count: 3.5 });
            expect(() => loop_expression.evaluate({ 'count times do': { text: 'Iteration' } }, badContext)).toThrow(
                'Times loop requires an integer value'
            );
        });

        it('throws on non-numeric values', () => {
            const badContext = createContext({ count: 'three' });
            expect(() => loop_expression.evaluate({ 'count times do': { text: 'Iteration' } }, badContext)).toThrow(
                'Times loop requires an integer value'
            );
        });
    });

    describe('.evaluate range loop with "for" syntax', () => {
        it('evaluates inclusive range with .. syntax', () => {
            const result = loop_expression.evaluate({ 'for n in 1..3': { text: 'Range item ${n}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
            expect(items[0].context).toHaveProperty('n', 1);
            expect(items[1].context).toHaveProperty('n', 2);
            expect(items[2].context).toHaveProperty('n', 3);
        });

        it('evaluates exclusive range with ... syntax', () => {
            const result = loop_expression.evaluate(
                {
                    'for n in 1...4': { text: 'Range item ${n}' },
                },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
            expect(items[0].context).toHaveProperty('n', 1);
            expect(items[1].context).toHaveProperty('n', 2);
            expect(items[2].context).toHaveProperty('n', 3);
        });

        it('supports both operators with inclusive range', () => {
            const result = loop_expression.evaluate(
                {
                    'for n of 1..3': { text: 'Range item ${n}' },
                },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
            expect(items[0].context).toHaveProperty('n', 1);
            expect(items[1].context).toHaveProperty('n', 2);
            expect(items[2].context).toHaveProperty('n', 3);
        });

        it('supports context variables with inclusive range', () => {
            const rangeContext = createContext({ start: 3, end: 6 });
            const result = loop_expression.evaluate(
                {
                    'for n of start..end': { text: 'Range item ${n}' },
                },
                rangeContext
            );
            const items = Array.from(result);
            expect(items.length).toBe(4);
            expect(items[0].template).toEqual({ text: 'Range item 3' });
            expect(items[1].template).toEqual({ text: 'Range item 4' });
            expect(items[2].template).toEqual({ text: 'Range item 5' });
            expect(items[3].template).toEqual({ text: 'Range item 6' });
            expect(items[0].context).toHaveProperty('n', 3);
            expect(items[3].context).toHaveProperty('n', 6);
        });

        it('supports context variables with exclusive range', () => {
            const rangeContext = createContext({ start: 3, end: 6 });
            const result = loop_expression.evaluate(
                { 'for n of start...end': { text: 'Range item ${n}' } },
                rangeContext
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 3' });
            expect(items[1].template).toEqual({ text: 'Range item 4' });
            expect(items[2].template).toEqual({ text: 'Range item 5' });
            expect(items[0].context).toHaveProperty('n', 3);
            expect(items[2].context).toHaveProperty('n', 5);
        });

        it('throws on non-numeric range values', () => {
            const badContext = createContext({ start: 'one', end: 3 });
            expect(() =>
                loop_expression.evaluate(
                    {
                        'for n in start..end': { text: 'Range item ${n}' },
                    },
                    badContext
                )
            ).toThrow('Range values must be integers');
        });

        it('throws on decimal range values', () => {
            const badContext = createContext({ start: 1.5, end: 4 });
            expect(() =>
                loop_expression.evaluate(
                    {
                        'for n in start..end': { text: 'Range item ${n}' },
                    },
                    badContext
                )
            ).toThrow('Range values must be integers');
        });
    });

    describe('.evaluate range loop with "each" alias', () => {
        it('evaluates inclusive range with .. syntax', () => {
            const result = loop_expression.evaluate({ 'each n in 1..3': { text: 'Range item ${n}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
            expect(items[0].context).toHaveProperty('n', 1);
            expect(items[1].context).toHaveProperty('n', 2);
            expect(items[2].context).toHaveProperty('n', 3);
        });

        it('evaluates exclusive range with ... syntax', () => {
            const result = loop_expression.evaluate({ 'each n in 1...4': { text: 'Range item ${n}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
        });

        it('supports both operators with inclusive range', () => {
            const result = loop_expression.evaluate({ 'each n of 1..3': { text: 'Range item ${n}' } }, context);
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 1' });
            expect(items[1].template).toEqual({ text: 'Range item 2' });
            expect(items[2].template).toEqual({ text: 'Range item 3' });
        });

        it('supports context variables with inclusive range', () => {
            const rangeContext = createContext({ start: 3, end: 6 });
            const result = loop_expression.evaluate(
                { 'each n of start..end': { text: 'Range item ${n}' } },
                rangeContext
            );
            const items = Array.from(result);
            expect(items.length).toBe(4);
            expect(items[0].template).toEqual({ text: 'Range item 3' });
            expect(items[1].template).toEqual({ text: 'Range item 4' });
            expect(items[2].template).toEqual({ text: 'Range item 5' });
            expect(items[3].template).toEqual({ text: 'Range item 6' });
        });

        it('supports context variables with exclusive range', () => {
            const rangeContext = createContext({ start: 3, end: 6 });
            const result = loop_expression.evaluate(
                { 'each n of start...end': { text: 'Range item ${n}' } },
                rangeContext
            );
            const items = Array.from(result);
            expect(items.length).toBe(3);
            expect(items[0].template).toEqual({ text: 'Range item 3' });
            expect(items[1].template).toEqual({ text: 'Range item 4' });
            expect(items[2].template).toEqual({ text: 'Range item 5' });
        });

        it('throws on non-numeric range values', () => {
            const badContext = createContext({ start: 'one', end: 3 });
            expect(() =>
                loop_expression.evaluate({ 'each n in start..end': { text: 'Range item ${n}' } }, badContext)
            ).toThrow('Range values must be integers');
        });

        it('throws on decimal range values', () => {
            const badContext = createContext({ start: 1.5, end: 4 });
            expect(() =>
                loop_expression.evaluate({ 'each n in start..end': { text: 'Range item ${n}' } }, badContext)
            ).toThrow('Range values must be integers');
        });
    });

    describe('.evaluate array iteration with index', () => {
        it('supports default index variable', () => {
            const result = loop_expression.evaluate(
                { 'for user of users with index': { text: '${index}: ${user.name}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(2);
            expect(items[0].template).toEqual({ text: '0: Alice' });
            expect(items[1].template).toEqual({ text: '1: Bob' });
            expect(items[0].context).toHaveProperty('index', 0);
            expect(items[0].context).toHaveProperty('user');
            expect(items[1].context).toHaveProperty('index', 1);
        });

        it('supports custom index variable', () => {
            const result = loop_expression.evaluate(
                { 'for user of users with i': { text: '${i}: ${user.name}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(2);
            expect(items[0].template).toEqual({ text: '0: Alice' });
            expect(items[1].template).toEqual({ text: '1: Bob' });
            expect(items[0].context).toHaveProperty('i', 0);
            expect(items[1].context).toHaveProperty('i', 1);
        });

        it('supports index with "each" keyword', () => {
            const result = loop_expression.evaluate(
                { 'each user of users with n': { text: '${n}: ${user.name}' } },
                context
            );
            const items = Array.from(result);
            expect(items.length).toBe(2);
            expect(items[0].template).toEqual({ text: '0: Alice' });
            expect(items[1].template).toEqual({ text: '1: Bob' });
            expect(items[0].context).toHaveProperty('n', 0);
            expect(items[1].context).toHaveProperty('n', 1);
        });

        it('validates "with" syntax', () => {
            expect(loop_expression.check('for user of users with index')).toBe(true);
            expect(loop_expression.check('for user of users with i')).toBe(true);
            expect(loop_expression.check('each user of users with pos')).toBe(true);
            expect(loop_expression.check('for user of users with')).toBe(false);
            expect(loop_expression.check('for user of users with as i')).toBe(false);
        });

        it('throws on invalid array access', () => {
            const badContext = createContext({ items: 'not an array' });
            expect(() =>
                loop_expression.evaluate({ 'for item of items with i': { text: '${i}: ${item}' } }, badContext)
            ).toThrow('not an array');
        });
    });

    describe('loop_expression.evaluate', () => {
        const loopTestCases: Record<string, LoopTestCase> = {
            'example with times': {
                loop: {
                    '2 times with n do': {
                        mycomponent: 'Iteration ${n}',
                    },
                },
                template: [{ mycomponent: 'Iteration 1' }, { mycomponent: 'Iteration 2' }],
            },
            'example with times without variable': {
                loop: {
                    '3 times do': {
                        text: 'Iteration',
                    },
                },
                template: [{ text: 'Iteration' }, { text: 'Iteration' }, { text: 'Iteration' }],
            },
            'example with times using context variable': {
                loop: {
                    'count times with i do': {
                        text: 'Count ${i}',
                    },
                },
                template: [{ text: 'Count 1' }, { text: 'Count 2' }, { text: 'Count 3' }],
                context: { count: 3 },
            },
            'for array iteration': {
                loop: {
                    'for item of items': {
                        text: 'Item: ${item}',
                    },
                },
                template: [{ text: 'Item: a' }, { text: 'Item: b' }, { text: 'Item: c' }],
                context: { items: ['a', 'b', 'c'] },
            },
            'each array iteration': {
                loop: {
                    'each item of items': {
                        text: 'Item: ${item}',
                    },
                },
                template: [{ text: 'Item: a' }, { text: 'Item: b' }, { text: 'Item: c' }],
                context: { items: ['a', 'b', 'c'] },
            },
            'for array iteration with index': {
                loop: {
                    'for item of items with idx': {
                        text: '${idx}: ${item}',
                    },
                },
                template: [{ text: '0: a' }, { text: '1: b' }, { text: '2: c' }],
                context: { items: ['a', 'b', 'c'] },
            },
            'for object iteration': {
                loop: {
                    'for key in person': {
                        text: '${key}: ${person[key]}',
                    },
                },
                template: [{ text: 'name: Charlie' }, { text: 'age: 35' }, { text: 'city: San Francisco' }],
                context: {
                    person: {
                        name: 'Charlie',
                        age: 35,
                        city: 'San Francisco',
                    },
                },
            },
            'each object iteration with index': {
                loop: {
                    'each key in person with i': {
                        text: '${i}. ${key}',
                    },
                },
                template: [{ text: '0. name' }, { text: '1. age' }, { text: '2. city' }],
                context: {
                    person: {
                        name: 'Charlie',
                        age: 35,
                        city: 'San Francisco',
                    },
                },
            },
            'for range iteration': {
                loop: {
                    'for n of 1..3': {
                        text: 'Number ${n}',
                    },
                },
                template: [{ text: 'Number 1' }, { text: 'Number 2' }, { text: 'Number 3' }],
            },
            'each range iteration exclusive': {
                loop: {
                    'each n of 1...4': {
                        text: 'Number ${n}',
                    },
                },
                template: [{ text: 'Number 1' }, { text: 'Number 2' }, { text: 'Number 3' }],
            },
            'complex nested template': {
                loop: {
                    'for user of users': {
                        user: {
                            name: '${user.name} global age: ${age}',
                            age: '${user.age}',
                            greeting: 'Hello, my name is ${user.name} and I am ${user.age} years old',
                        },
                    },
                },
                // Now we test specific properties of the structured output
                test: (items) => {
                    expect(items.length).toBe(2);

                    // First item tests
                    expect(items[0].template).toEqual({
                        user: {
                            name: 'Alice global age: 18',
                            age: 25,
                            greeting: 'Hello, my name is Alice and I am 25 years old',
                        },
                    });
                    expect(items[0].context).toHaveProperty('user', { name: 'Alice', age: 25 });

                    // Second item tests
                    expect(items[1].template).toEqual({
                        user: {
                            name: 'Bob global age: 18',
                            age: 30,
                            greeting: 'Hello, my name is Bob and I am 30 years old',
                        },
                    });
                    expect(items[1].context).toHaveProperty('user', { name: 'Bob', age: 30 });
                },
                context: {
                    age: 18,
                    users: [
                        { name: 'Alice', age: 25 },
                        { name: 'Bob', age: 30 },
                    ],
                },
            },
            'overrides outter context if variable names are the same': {
                loop: {
                    'for user of users': {
                        mycomponent: 'User ${user.name} is ${user.age} years old',
                    },
                },
                test: (items) => {
                    expect(items.length).toBe(2);

                    // Test template properties
                    expect(items[0].template).toEqual({ mycomponent: 'User Alice is 25 years old' });
                    expect(items[1].template).toEqual({ mycomponent: 'User Bob is 30 years old' });

                    // Test context values
                    expect(items[0].context).toHaveProperty('user', { name: 'Alice', age: 25 });
                    expect(items[1].context).toHaveProperty('user', { name: 'Bob', age: 30 });
                },
                context: {
                    user: {
                        name: 'Logged In User',
                        age: 30,
                    },
                    users: [
                        { name: 'Alice', age: 25 },
                        { name: 'Bob', age: 30 },
                    ],
                },
            },
        };

        Object.entries(loopTestCases).forEach(
            ([description, { loop, template: output, test: testFn, context = {} }]) => {
                test(description, () => {
                    const testContext = createContext(context);
                    const result = loop_expression.evaluate(loop, testContext);
                    const items = Array.from(result);

                    if (testFn) {
                        // Use the custom test function
                        testFn(items);
                    } else if (output) {
                        // For backward compatibility with older test cases
                        expect(items.map((item) => item.template)).toEqual(output);
                    }
                });
            }
        );

        // Error handling tests
        test('throws on invalid loop expression', () => {
            const testContext = createContext({});
            const invalidLoop = { 'invalid syntax': { text: 'This should fail' } };
            expect(() => Array.from(loop_expression.evaluate(invalidLoop, testContext))).toThrow();
        });

        test('throws on non-existent iterable', () => {
            const testContext = createContext({});
            const invalidLoop = { 'for item of nonExistentArray': { text: 'Item: ${item}' } };
            expect(() => Array.from(loop_expression.evaluate(invalidLoop, testContext))).toThrow(
                'not found in context'
            );
        });

        test('throws on non-array iterable', () => {
            const testContext = createContext({ items: 'not an array' });
            const invalidLoop = { 'for item of items': { text: 'Item: ${item}' } };
            expect(() => Array.from(loop_expression.evaluate(invalidLoop, testContext))).toThrow('not an array');
        });
    });
});

type LoopTestCase = {
    loop: Record<string, Template>;
    template?: Any[];
    test?: (items: LoopItem[]) => void;
    context?: Record<string, Any>;
};
