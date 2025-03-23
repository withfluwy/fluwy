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

    it('returns empty string for unresolvable variables', () => {
        expect(compile('Address: ${contact.address.line1}', { contact }, { keepPlaceholders: false })).toBe(
            'Address: '
        );
        expect(compile('Address: ${contact.address.line1}', { contact })).toBe('Address: ${contact.address.line1}');

        expect(compile('${record.id} - ${path}', { contact }, { keepPlaceholders: false })).toBe(' - ');
        expect(compile('${record.id} - ${path}', { contact })).toBe('${record.id} - ${path}');
    });

    it('resolves to empty string if the value is null or undefined', () => {
        expect(compile('test ${contact.age}', { contact }, { keepPlaceholders: false })).toBe('test ');
        expect(compile('test ${contact.age}', { contact })).toBe('test ${contact.age}');
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

    it('supports bracket notation for object access', () => {
        const data = {
            users: {
                active: {
                    admins: {
                        '123': {
                            profile: {
                                contact: {
                                    email: 'deep@example.com',
                                },
                            },
                        },
                    },
                },
            },
            person: {
                name: 'John',
                details: {
                    age: 30,
                    email: 'john@example.com',
                },
            },
        };
        const key = 'name';
        const nestedKey = 'email';
        const detailsKey = 'details';
        const status = 'active';
        const role = 'admins';
        const userId = '123';
        const contactPath = 'contact';
        const profileKey = 'profile';

        // Simple bracket notation
        expect(compile('${person[key]}', { ...data, key })).toBe('John');

        // Nested bracket notation
        expect(compile('${person.details[nestedKey]}', { ...data, nestedKey })).toBe('john@example.com');

        // Nested bracket notation with details key
        expect(compile('${person[detailsKey][nestedKey]}', { ...data, nestedKey, detailsKey })).toBe(
            'john@example.com'
        );

        // Multiple bracket notations in one template
        expect(compile('Name: ${person[key]}, Email: ${person.details[nestedKey]}', { ...data, key, nestedKey })).toBe(
            'Name: John, Email: john@example.com'
        );

        // Deep nesting with multiple bracket notations
        expect(
            compile('${users[\'active\']["admins"][userId][profileKey][contactPath][nestedKey]}', {
                ...data,
                status,
                role,
                userId,
                profileKey,
                contactPath,
                nestedKey,
            })
        ).toBe('deep@example.com');

        // Mixed deep nesting with dots and brackets
        expect(
            compile('${users.active[role][userId].profile[contactPath][nestedKey]}', {
                ...data,
                role,
                userId,
                contactPath,
                nestedKey,
            })
        ).toBe('deep@example.com');
    });

    it('returns empty string for unresolvable bracket notation', () => {
        const person = { name: 'John' };
        const key = 'age'; // key that doesn't exist

        // When the property doesn't exist
        expect(compile('${person[key]}', { person, key }, { keepPlaceholders: false })).toBe('');
        expect(compile('${person[key]}', { person, key })).toBe('${person[key]}');

        // When the key variable doesn't exist
        expect(compile('${person[missingKey]}', { person }, { keepPlaceholders: false })).toBe('');
        expect(compile('${person[missingKey]}', { person })).toBe('${person[missingKey]}');

        // Mixed with static text
        expect(compile('Name: ${person[key]}', { person, key }, { keepPlaceholders: false })).toBe('Name: ');
        expect(compile('Name: ${person[key]}', { person, key })).toBe('Name: ${person[key]}');
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
