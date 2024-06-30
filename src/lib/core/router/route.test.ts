import { beforeAll, describe, expect, test, afterAll } from 'vitest';
import fs from 'fs';
import { findRoute } from './route';
import path from 'path';
import { createFiles, createTestingDir, deleteDirectory } from '../test/utils';

type TestCases = {
	[file: string]: { contents: string; routes: Record<string, Record<string, unknown>> };
};

describe('findRoute', () => {
	let testingDir: string;
	const routeTestCases: TestCases = {
		'/index.yaml': {
			contents: 'home page',
			routes: {
				'/': {},
			},
		},
		'/[slug]/index.yaml': {
			contents: 'Slug page',
			routes: {
				'/home': { slug: 'home' },
				'/about': { slug: 'about' },
			},
		},
		'/transactions/index.yaml': {
			contents: 'transactions list',
			routes: {
				'/transactions': {},
				'/transactions/': {},
			},
		},
		'/contacts.yaml': {
			contents: 'Contacts list',
			routes: {
				'/contacts': {},
				'/contacts/': {},
			},
		},
		'/contacts/[id]/index.yaml': {
			contents: 'Contact Profile',
			routes: {
				'/contacts/1': { id: 1 },
				'/contacts/1/': { id: 1 },
				'/contacts/abc': { id: 'abc' },
			},
		},
		'/contacts/[id]/transactions/[trxid]/index.yaml': {
			contents: `Contact's Transactions`,
			routes: {
				'/contacts/1/transactions/2': { id: 1, trxid: 2 },
				'/contacts/1/transactions/2/': { id: 1, trxid: 2 },
				'/contacts/abc/transactions/xpto': { id: 'abc', trxid: 'xpto' },
				'/contacts/abc/transactions/xpto/': { id: 'abc', trxid: 'xpto' },
				'/contacts/123/transactions/abc': { id: 123, trxid: 'abc' },
				'/contacts/123/transactions/abc/': { id: 123, trxid: 'abc' },
			},
		},
	};

	beforeAll(() => {
		testingDir = createTestingDir();

		const fileContentMap = Object.entries(routeTestCases).reduce(
			(acc, [file, testCase]) => ({
				...acc,
				[file]: testCase.contents,
			}),
			{}
		);

		createFiles(testingDir, fileContentMap);
	});

	afterAll(() => {
		deleteDirectory(testingDir);
	});

	test('check if test functions are working properly', () => {
		for (const [file, testCase] of Object.entries(routeTestCases)) {
			const fileNotFound = `File ${file} not found`;
			const contentDoesNotMatch = `Content of file ${file} does not match`;

			expect(fs.existsSync(path.resolve(`${testingDir}/${file}`)), fileNotFound).to.be.true;
			expect(
				fs.readFileSync(path.resolve(`${testingDir}/${file}`), 'utf8'),
				contentDoesNotMatch
			).toBe(testCase.contents);
		}
	});

	describe('route tests', () => {
		for (const [file, testCase] of Object.entries(routeTestCases)) {
			for (const [routePath, params] of Object.entries(testCase.routes)) {
				test(`${routePath} -- reads --> ${file}`, async () => {
					const route = findRoute(routePath, testingDir)!;
					expect(route.filepathAbsolute).toEqual(path.join(testingDir, file));
					expect(route.path).toEqual(routePath.replace(/\/$/, ''));
					expect(route.contents).toEqual(testCase.contents);
					expect(route.params).toEqual(params);
				});
			}
		}
	});
});
