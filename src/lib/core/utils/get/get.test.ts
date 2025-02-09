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

    it('returns null if the path is null and no default value is provided', () => {
        expect(get({ name: null }, 'name')).toBe(null);
    });

    it('returns the default value if the path is null and a default value is provided', () => {
        expect(get({ name: null }, 'name', 'default')).toBe('default');
    });

    it('returns the value from a nested object with dot notation', () => {
        expect(get({ contact: { name: 'Marco' } }, 'contact.name')).toBe('Marco');
        expect(get({ contact: { name: 'Marco' } }, 'contact.age', 'default')).toBe('default');
        expect(get({ contact: {} }, 'contact.name', 'default')).toBe('default');
        expect(get({ contact: { name: undefined } }, 'contact.name', 'default')).toBe('default');
    });

    it('accepts keys with dot notation', () => {
        const form = {
            id: 1,
            data: {
                'user.email': 'marco@mail',
                'user.password': 'mysecretpassword',
                admin: {
                    access: true,
                },
            },
            'connect.database': true,
        };

        expect(get(form, 'id')).toBe(1);
        expect(get(form, 'data.user.email')).toBe('marco@mail');
        expect(get(form, 'data.user.password')).toBe('mysecretpassword');
        expect(get(form, 'data.admin.access')).toBe(true);
        expect(get(form, 'connect.database')).toBe(true);
    });
});
