import { describe, expect, it } from 'vitest';
import { wrap_into } from '.';
import type { Context } from '../../context';

describe('wrap_into operation', () => {
	it('should wrap the result into the specified wrapper', async () => {
		// Given
		const wrapper = 'data';
		const result = {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@mail.com',
		};

		// When
		const wrappedResult = await wrap_into(wrapper, {} as Context, result);

		// Then
		expect(wrappedResult).toEqual({
			data: result,
		});
	});
});
