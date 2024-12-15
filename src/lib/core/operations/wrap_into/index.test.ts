import { describe, expect, it } from 'vitest';
import { wrap_into } from './index.js';
import { createContext } from '../../context/index.js';

describe('wrap_into operation', () => {
    it('should wrap the result into the specified wrapper', async () => {
        // Given
        const context = createContext();
        const wrapper = 'data';
        const result = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@mail.com',
        };

        // When
        const wrappedResult = await wrap_into(wrapper, { context, previousResult: result });

        // Then
        expect(wrappedResult).toEqual({
            data: result,
        });
    });
});
