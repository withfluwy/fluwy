import { beforeEach, describe, expect, it } from 'vitest';
import { extract } from './index.js';
import { createContext, type Context } from '../../context/index.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';

describe('extract operation', () => {
    let context: Context;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        app = createApp();
    });

    const previousResult = {
        id: 1,
        createdAt: new Date(),
        attributes: {
            name: 'John Doe',
            email: 'john.doe@mail.com',
            phone: '1234567890',
            address: {
                line1: '123 Main St',
                country: 'US',
            },
        },
    };

    it('extracts the data based on the map', async () => {
        // Given
        const map = {
            id: 'id',
            name: 'attributes.name',
            email: 'attributes.email',
        };

        // When
        const result = await extract(map, { context, previousResult, app });

        // Then
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'john.doe@mail.com',
        });
    });

    it('also returns expanded objects if the mapping nested objects with dot notation', async () => {
        // Given
        const map = {
            id: 'id',
            name: 'attributes.name',
            'contact.name': 'attributes.name',
            'contact.email': 'attributes.email',
        };

        // When
        const result = await extract(map, { context, previousResult, app });

        // Then
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            contact: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
            },
        });
    });
});
