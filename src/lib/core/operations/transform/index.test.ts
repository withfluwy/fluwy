import { describe, expect, it } from 'vitest';
import { transform } from './index.js';
import { createApp, createContext } from '@/lib/index.js';

describe('transform operation', () => {
    it('transforms the previous result based on the map', async () => {
        const context = createContext();
        const app = createApp();

        const previousResult = {
            id: 1,
            attributes: {
                name: 'John Doe',
                email: 'john.doe@mail.com',
                phone: '1234567890',
            },
            createdAt: '2021-01-01',
        };
        const map = {
            'attributes.name': 'name',
            'attributes.email': 'email',
        };

        const result = await transform(map, { context, previousResult, app });

        expect(result).toEqual({
            name: 'John Doe',
            email: 'john.doe@mail.com',
        });
    });
});
