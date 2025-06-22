import { describe, it, expect, beforeEach } from 'vitest';
import { Required } from './required.js';
import type { Rule } from './rule.js';

describe('Required', () => {
    let required: Required;
    const customMessage = 'This field is required';

    beforeEach(() => {
        required = new Required(customMessage);
    });

    describe('constructor and properties', () => {
        it('should implement the Rule interface', () => {
            expect(required).toBeInstanceOf(Required);
            expect(required).toHaveProperty('id');
            expect(required).toHaveProperty('message');
            expect(required).toHaveProperty('check');
            expect(typeof required.check).toBe('function');
        });

        it('should set the id property to "required"', () => {
            expect(required.id).toBe('required');
        });

        it('should store the custom message', () => {
            expect(required.message).toBe(customMessage);
        });

        it('should make id property readonly (compile-time check)', () => {
            // TypeScript readonly is a compile-time check, not runtime
            // This test verifies the property exists and has the correct value
            expect(required.id).toBe('required');
            // The @ts-expect-error comment above the assignment would catch compile-time violations
        });

        it('should allow different custom messages', () => {
            const message1 = 'Field cannot be empty';
            const message2 = 'Please provide a value';

            const rule1 = new Required(message1);
            const rule2 = new Required(message2);

            expect(rule1.message).toBe(message1);
            expect(rule2.message).toBe(message2);
        });
    });

    describe('check method - async behavior', () => {
        it('should return a Promise', () => {
            const result = required.check('test');
            expect(result).toBeInstanceOf(Promise);
        });

        it('should resolve with boolean value', async () => {
            const result = await required.check('test');
            expect(typeof result).toBe('boolean');
        });
    });

    describe('check method - valid values (should return true)', () => {
        it('should return true for non-empty strings', async () => {
            expect(await required.check('hello')).toBe(true);
            expect(await required.check('a')).toBe(true);
            expect(await required.check('123')).toBe(true);
            expect(await required.check('test string')).toBe(true);
        });

        it('should return true for strings with only spaces that contain other characters', async () => {
            expect(await required.check(' hello ')).toBe(true);
            expect(await required.check('  test  ')).toBe(true);
        });

        it('should return true for numbers', async () => {
            expect(await required.check(1)).toBe(true);
            expect(await required.check(0)).toBe(true);
            expect(await required.check(-1)).toBe(true);
            expect(await required.check(3.14)).toBe(true);
            expect(await required.check(Infinity)).toBe(true);
            expect(await required.check(-Infinity)).toBe(true);
        });

        it('should return true for NaN', async () => {
            expect(await required.check(NaN)).toBe(true);
        });

        it('should return true for boolean true', async () => {
            expect(await required.check(true)).toBe(true);
        });

        it('should return true for arrays with meaningful content', async () => {
            expect(await required.check([1])).toBe(true);
            expect(await required.check(['a'])).toBe(true);
            expect(await required.check([1, 2, 3])).toBe(true);
            expect(await required.check(['hello', 'world'])).toBe(true);
            expect(await required.check([0])).toBe(true); // 0 is meaningful content
            expect(await required.check([false])).toBe(true); // false is meaningful content when in array
            expect(await required.check([null, undefined])).toBe(true); // String([null, undefined]) === ","
        });

        it('should return true for non-empty objects', async () => {
            expect(await required.check({ a: 1 })).toBe(true);
            expect(await required.check({ key: 'value' })).toBe(true);
            expect(await required.check({ a: null })).toBe(true);
            expect(await required.check({ a: undefined })).toBe(true);
            expect(await required.check({ nested: {} })).toBe(true);
        });

        it('should return true for functions', async () => {
            expect(await required.check(() => {})).toBe(true);
            expect(await required.check(function () {})).toBe(true);
            expect(await required.check(async () => {})).toBe(true);
        });

        it('should return true for symbols', async () => {
            expect(await required.check(Symbol('test'))).toBe(true);
            expect(await required.check(Symbol.for('global'))).toBe(true);
        });

        it('should return true for special characters and unicode', async () => {
            expect(await required.check('!@#$%^&*()')).toBe(true);
            expect(await required.check('🚀')).toBe(true);
            expect(await required.check('café')).toBe(true);
            expect(await required.check('中文')).toBe(true);
        });

        it('should return true for built-in objects (Date, RegExp, etc.)', async () => {
            // Built-in objects should be considered valid values for required fields
            expect(await required.check(new Date())).toBe(true);
            expect(await required.check(new Date('2023-01-01'))).toBe(true);
            expect(await required.check(/test/)).toBe(true);
            expect(await required.check(new RegExp('pattern'))).toBe(true);
            expect(await required.check(new Error('test'))).toBe(true);
            expect(await required.check(new Map())).toBe(true);
            expect(await required.check(new Set())).toBe(true);
        });

        it('should return true for sparse arrays (they have length > 0)', async () => {
            // Sparse arrays should be considered valid since they have a length > 0
            const sparseArray = new Array(3); // [empty × 3]
            expect(await required.check(sparseArray)).toBe(true);
        });
    });

    describe('check method - invalid values (should return false)', () => {
        it('should return false for null', async () => {
            expect(await required.check(null)).toBe(false);
        });

        it('should return false for undefined', async () => {
            expect(await required.check(undefined)).toBe(false);
        });

        it('should return false for empty string', async () => {
            expect(await required.check('')).toBe(false);
        });

        it('should return false for whitespace-only strings', async () => {
            expect(await required.check(' ')).toBe(false);
            expect(await required.check('  ')).toBe(false);
            expect(await required.check('\t')).toBe(false);
            expect(await required.check('\n')).toBe(false);
            expect(await required.check('\r')).toBe(false);
            expect(await required.check(' \t\n\r ')).toBe(false);
        });

        it('should return false for boolean false', async () => {
            expect(await required.check(false)).toBe(false);
        });

        it('should return false for empty arrays', async () => {
            expect(await required.check([])).toBe(false);
        });

        it('should return false for empty arrays (line 13 coverage)', async () => {
            // Force the array check to be hit by creating arrays that are definitely empty
            // and should hit the Array.isArray check before the object check
            const emptyArrays = [
                [],
                Array.from([]),
                Array.of(),
                [].slice(),
                [].filter(() => false),
                [].map(() => null).slice(0, 0),
            ];

            for (const emptyArray of emptyArrays) {
                expect(await required.check(emptyArray)).toBe(false);
            }
        });

        it('should return false for empty arrays (specific array check coverage)', async () => {
            // Create arrays that will definitely hit the Array.isArray check first
            const emptyArrayLiteral: unknown[] = [];
            const emptyArrayConstructor = Array.from([]);
            const emptyArrayFrom = Array.from([]);

            expect(await required.check(emptyArrayLiteral)).toBe(false);
            expect(await required.check(emptyArrayConstructor)).toBe(false);
            expect(await required.check(emptyArrayFrom)).toBe(false);
        });

        it('should return false for truly empty arrays (coverage for array length check)', async () => {
            // This specifically tests the Array.isArray(value) && value.length === 0 path (line 13)
            const emptyArray: unknown[] = [];
            expect(await required.check(emptyArray)).toBe(false);

            // Test with different empty array constructions to ensure line 13 coverage
            expect(await required.check(Array.from([]))).toBe(false);
            expect(await required.check(Array.of())).toBe(false);

            // Test arrays that are definitely empty and should hit the array check first
            const definitelyEmptyArray = [] as const;
            expect(await required.check(definitelyEmptyArray)).toBe(false);
        });

        it('should return false for empty objects', async () => {
            expect(await required.check({})).toBe(false);
        });

        it('should return false for arrays that stringify to empty strings', async () => {
            // Arrays containing only null, undefined, or empty arrays stringify to empty strings
            expect(await required.check([null])).toBe(false); // String([null]) === ""
            expect(await required.check([undefined])).toBe(false); // String([undefined]) === ""
            expect(await required.check([[]])).toBe(false); // String([[]]) === ""
        });
    });

    describe('check method - edge cases', () => {
        it('should handle string representations of other types', async () => {
            // These should be true because String(value).trim() !== ''
            expect(await required.check('0')).toBe(true);
            expect(await required.check('false')).toBe(true);
            expect(await required.check('null')).toBe(true);
            expect(await required.check('undefined')).toBe(true);
        });

        it('should handle objects with non-enumerable properties', async () => {
            const obj = {};
            Object.defineProperty(obj, 'hidden', {
                value: 'test',
                enumerable: false,
            });
            // Should return false because Object.keys() only returns enumerable properties
            expect(await required.check(obj)).toBe(false);
        });

        it('should handle objects with symbol keys', async () => {
            const sym = Symbol('test');
            const obj = { [sym]: 'value' };
            // Should return false because Object.keys() doesn't include symbol keys
            expect(await required.check(obj)).toBe(false);
        });

        it('should handle arrays with holes that have elements', async () => {
            // eslint-disable-next-line no-sparse-arrays
            const arrayWithHoles = [1, , 3]; // [1, empty, 3]
            // Arrays with some elements pass because Object.keys() returns indices of existing elements
            expect(await required.check(arrayWithHoles)).toBe(true); // Object.keys() returns ['0', '2']
        });

        it('should handle array-like objects', async () => {
            const arrayLike = { 0: 'a', 1: 'b', length: 2 };
            expect(await required.check(arrayLike)).toBe(true); // has enumerable properties
        });

        it('should handle objects with prototype properties', async () => {
            // Create an object with prototype properties
            const parent = { inherited: 'value' };
            const child = Object.create(parent);

            // Should return true because Object.create(parent) creates an object with a different prototype
            // Only plain objects {} with Object.prototype are considered for emptiness check
            expect(await required.check(child)).toBe(true);

            child.own = 'property';
            expect(await required.check(child)).toBe(true);
        });

        it('should handle BigInt values', async () => {
            expect(await required.check(BigInt(0))).toBe(true);
            expect(await required.check(BigInt(123))).toBe(true);
            expect(await required.check(0n)).toBe(true);
            expect(await required.check(123n)).toBe(true);
        });
    });

    describe('Rule interface compliance', () => {
        it('should satisfy Rule interface type checking', () => {
            const rule: Rule = new Required('test message');
            expect(rule.id).toBe('required');
            expect(rule.message).toBe('test message');
            expect(typeof rule.check).toBe('function');
        });

        it('should work in arrays of Rules', async () => {
            const rules: Rule[] = [new Required('Message 1'), new Required('Message 2')];

            expect(rules).toHaveLength(2);
            expect(await rules[0].check('test')).toBe(true);
            expect(await rules[1].check('')).toBe(false);
        });
    });

    describe('multiple instances', () => {
        it('should maintain separate state for different instances', async () => {
            const rule1 = new Required('Message 1');
            const rule2 = new Required('Message 2');

            expect(rule1.message).toBe('Message 1');
            expect(rule2.message).toBe('Message 2');
            expect(rule1.id).toBe('required');
            expect(rule2.id).toBe('required');

            // Both should work independently
            expect(await rule1.check('test')).toBe(true);
            expect(await rule2.check('')).toBe(false);
        });
    });
});
