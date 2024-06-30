import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { App, createApp } from '.';
import { createFiles, createTestingDir, deleteDirectory, readFile } from '../test/utils';
import nock from 'nock';

describe('App', () => {
	let app: App;
	let testingDir: string;
	const testingAppFiles = {
		'layouts/base.yaml': readFile(__dirname, 'layouts/base.yaml'),
		'pages/contacts.yaml': readFile(__dirname, 'pages/contacts.yaml'),
		'pages/contacts/[id]/index.yaml': readFile(__dirname, 'pages/contacts/[id]/index.yaml'),
	};

	beforeAll(() => {
		app = createApp();
		testingDir = createTestingDir();

		createFiles(testingDir, testingAppFiles);

		app.config = {
			components: testingDir + '/components',
			pages: testingDir + '/pages',
			layouts: testingDir + '/layouts',
		};
	});

	afterAll(() => {
		deleteDirectory(testingDir);
	});

	describe('createApp helper', () => {
		it('creates an instance of App', async () => {
			expect(app).toBeDefined();
			expect(app).toBeInstanceOf(App);
		});

		it('has default configs', () => {
			expect(app.config).toBeDefined();
			expect(app.config.components).toBe(testingDir + '/components');
			expect(app.config.pages).toBe(testingDir + '/pages');
			expect(app.config.layouts).toBe(testingDir + '/layouts');
		});
	});

	describe('render', () => {
		it('returns a yaml document', async () => {
			const document = await app.render('/contacts');
			expect(document).toEqual({
				content: {
					header: 'Base Layout',
					slot: {
						header: 'Contacts Page',
					},
				},
			});
		});
	});

	describe('load feature on page meta', () => {
		const globalFetch = global.fetch;
		const contact = {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@mail.com',
			transaction: {
				id: 2,
				amount: 100,
				currency: {
					symbol: '£',
					value: 'USD',
				},
			},
		};
		const address = {
			id: 1,
			street: '123 Main St',
			city: 'London',
			country: 'UK',
		};
		let httpCalls: { [key: string]: nock.Scope | undefined } = {
			contacts: undefined,
			address: undefined,
		};

		beforeEach(() => {
			httpCalls.contacts = nock('http://127.0.0.1:8000')
				.persist()
				.get('/contacts/1')
				.reply(200, contact);
			httpCalls.address = nock('http://127.0.0.1:8000')
				.persist()
				.get('/address/1')
				.reply(200, { data: address });
		});

		afterEach(() => {
			global.fetch = globalFetch;
			nock.cleanAll();
		});

		it('makes an http call to load data to the page context', async () => {
			// When
			const result = await app.render('/contacts/1');

			// Expect
			expect(result).toEqual({
				content: {
					header: 'Base Layout',
					slot: [
						{ header: 'Contact Page John Doe - john.doe@mail.com' },
						{ div: 'Amount: £100' },
						{
							div: `Should keep unparsed var \${record.id} because record doesn't exit`,
						},
						{
							div: `Address: ${address.street}`,
						},
					],
				},
			});

			httpCalls.contacts?.done();
			httpCalls.address?.done();
		});
	});
});
