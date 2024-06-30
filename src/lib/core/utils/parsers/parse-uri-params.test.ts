import { describe, expect, it } from 'vitest';
import { parseUriParams } from './parse-uri-params';

describe('parseUriParams', () => {
	const testCases = {
		'/api/users/[id]/[name]': {
			record: { id: '1', name: 'john' },
			expected: '/api/users/1/john',
		},
		'/api/users/[id]/[name]/[age]': {
			record: { id: 1, name: 'john', age: 30 },
			expected: '/api/users/1/john/30',
		},
		'/contacts/[id]/transactions/[transaction.id]': {
			record: { id: 1, transaction: { id: 2 } },
			expected: '/contacts/1/transactions/2',
		},
	};

	it('should replace uri params with record values', () => {
		for (const [uri, testCase] of Object.entries(testCases)) {
			const result = parseUriParams(uri, testCase.record);

			expect(result).toEqual(testCase.expected);
		}
	});
});
