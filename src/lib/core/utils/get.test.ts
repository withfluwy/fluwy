import { describe, expect, it } from 'vitest';
import { get } from './index.js';

describe('get function', () => {
    it('returns the value at the specified path', () => {
        expect(get({ name: 'Marco' }, 'name')).toBe('Marco');
    });
    it('returns the default value if the path does not exist', () => {
        expect(get({ name: 'Marco' }, 'age', 'default')).toBe('default');
    });

    it('returns the default value if the path is undefined', () => {
        expect(get({}, 'age', 'default')).toBe('default');
        expect(get({ age: undefined }, 'age', 'default')).toBe('default');
    });

    it('returns the value from a nested object with dot notation', () => {
        expect(get({ contact: { name: 'Marco' } }, 'contact.name')).toBe('Marco');
        expect(get({ contact: { name: 'Marco' } }, 'contact.age', 'default')).toBe('default');
        expect(get({ contact: {} }, 'contact.name', 'default')).toBe('default');
        expect(get({ contact: { name: undefined } }, 'contact.name', 'default')).toBe('default');
    });
});
