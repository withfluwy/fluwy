import { describe, expect, it } from 'vitest';
import { collapseObject, expandObject } from './index.js';

describe('collapseObject and expandObject', () => {
    describe('collapseObject', () => {
        it('collapses nested objects into a single object', () => {
            // Given
            const object = {
                id: 1,
                attributes: {
                    name: 'John Doe',
                    email: 'john.doe@mail.com',
                    items: [1, 2, 3],
                    createdAt: new Date(),
                    address: {
                        line1: '123 Main St',
                        country: null,
                        zip: undefined,
                    },
                },
            };
            expect(collapseObject(object)).toEqual({
                id: 1,
                'attributes.name': 'John Doe',
                'attributes.email': 'john.doe@mail.com',
                'attributes.address.line1': '123 Main St',
                'attributes.address.country': null,
                'attributes.address.zip': undefined,
                'attributes.items': [1, 2, 3],
            });
        });
    });

    describe('expandObject', () => {
        it('expands a collapsed object into its original form', () => {
            // Given
            const object = {
                id: 1,
                'attributes.name': 'John Doe',
                'attributes.email': 'john.doe@mail.com',
                'attributes.createdAt': new Date(),
                'attributes.address.line1': '123 Main St',
                'attributes.address.country': null,
                'attributes.address.zip': undefined,
                'attributes.items': [1, 2, 3],
            };

            expect(expandObject(object)).toEqual({
                id: 1,
                attributes: {
                    name: 'John Doe',
                    email: 'john.doe@mail.com',
                    createdAt: expect.any(Date),
                    items: [1, 2, 3],
                    address: {
                        line1: '123 Main St',
                        country: null,
                        zip: undefined,
                    },
                },
            });
        });

        it('expands the object recursively', () => {
            // Given
            const object = {
                id: 1,
                data: {
                    'attributes.name': 'John Doe',
                    'attributes.email': 'john.doe@mail.com',
                    'attributes.createdAt': new Date(),
                    'attributes.address.line1': '123 Main St',
                    'attributes.address.country': null,
                    'attributes.address.zip': undefined,
                    'attributes.items': [1, 2, 3],
                },
            };

            expect(expandObject(object)).toEqual({
                id: 1,
                data: {
                    attributes: {
                        name: 'John Doe',
                        email: 'john.doe@mail.com',
                        createdAt: expect.any(Date),
                        items: [1, 2, 3],
                        address: {
                            line1: '123 Main St',
                            country: null,
                            zip: undefined,
                        },
                    },
                },
            });
        });

        it('expands the object merging its properties', () => {
            // Given
            const object = {
                id: 1,
                data: {
                    name: 'John Doe',
                    email: 'john.doe@mail.com',
                    'address.line1': '123 Main St',
                    address: {
                        country: 'US',
                        zip: '12345',
                    },
                    'address.zip': '67890',
                },
            };

            expect(expandObject(object)).toEqual({
                id: 1,
                data: {
                    name: 'John Doe',
                    email: 'john.doe@mail.com',
                    address: {
                        line1: '123 Main St',
                        country: 'US',
                        zip: '67890',
                    },
                },
            });
        });
    });
});
