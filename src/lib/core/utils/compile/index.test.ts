import { describe, expect, it } from 'vitest';
import { compile, hasPlaceholders } from './index.js';
import type { Context } from '../../contracts.js';

describe('compile', () => {
    const contact = {
        id: '123',
        name: 'John Doe',
        age: undefined,
        transaction: {
            amount: 100,
        },
    };

    it('resolves variables with their values', () => {
        const template = '${contact.name} - ${contact.id} / $${contact.transaction.amount}';
        const result = compile(template, { contact });
        expect(result).toBe('John Doe - 123 / $100');
    });

    it('keeps the placeholders if cannot resolve variables', () => {
        expect(compile('Address: ${contact.address.line1}', { contact })).toBe('Address: ${contact.address.line1}');
        expect(compile('${record.id} - ${path}', { contact })).toBe('${record.id} - ${path}');
    });

    it('resolves to empty string if the value is null or undefined', () => {
        expect(compile('test ${contact.age}', { contact })).toBe('test ');
    });

    it('returns the compiled string as a javascript value', () => {
        expect(compile('${isBoolean}', { isBoolean: true })).toBe(true);
        expect(compile('${isBoolean}', { isBoolean: false })).toBe(false);
        expect(compile('${number}', { number: 123 })).toBe(123);
        expect(compile('${number}', { number: 0 })).toBe(0);
        expect(compile('${number}', { number: 13.24 })).toBe(13.24);
        expect(compile('${string}', { string: 'hello' })).toBe('hello');
        expect(compile('${string}', { string: '' })).toBe('');
        expect(compile('${string}', { string: '   ' })).toBe('');
        expect(compile('contact', { contact })).toEqual(contact);
        expect(compile('contact.transaction', { contact })).toEqual(contact.transaction);
    });

    it('keeps the string intact if theres no placeholders to replace', () => {
        expect(compile('http://127.0.0.1:8000/contacts', { contact })).toBe('http://127.0.0.1:8000/contacts');
    });

    it('returns the string intact if theres no variables to replace', () => {
        const data = {} as Context;

        expect(compile('Configuration', data)).toEqual('Configuration');
    });

    it('resolves nested variables with dot notation', () => {
        const form = {
            id: 1,
            'connect.database': true,
            data: {
                'user.email': 'marco@mail',
                'user.password': 'mysecretpassword',
                admin: {
                    access: true,
                },
            },
        };
        const context = { form };

        expect(compile('${form.id}', context)).toBe(1);
        expect(compile('${form.connect.database}', context)).toBe(true);
        expect(compile('${form.data.user.email}', context)).toBe('marco@mail');
        expect(compile('${form.data.user.password}', context)).toBe('mysecretpassword');
        expect(compile('${form.data.admin.access}', context)).toBe(true);
    });

    describe('hasPlaceholders', () => {
        it('should return true if the template has any placeholders', () => {
            expect(hasPlaceholders('${record.id}')).toBe(true);
        });
    });
});
