import type { Any, Operation } from '../contracts.js';
import { compile } from '../utils/compile/index.js';

export const set_operation: Operation = async (cookie: Record<string, Any>, context) => {
	const cookies: Record<string, Any> = {};

	for (const [key, rawValue] of Object.entries(cookie)) {
		cookies[key] = compile(rawValue, context.data);
	}

	await context.fetch('/__server__/set-cookie', {
		body: JSON.stringify(cookies),
		method: 'POST',
	});
};

export const unset_operation: Operation = async (cookie: string, context) => {
	await context.fetch('/__server__/unset-cookie', {
		body: JSON.stringify({ [cookie]: true }),
		method: 'POST',
	});
};

type ServerFunction = (event: Any) => Promise<Any>;

export const endpoints: Record<string, ServerFunction> = {
	'/__server__/set-cookie': async (event) => {
		const cookies = await event.request.json();
		const headers = new Headers();

		for (const [cookie, value] of Object.entries(cookies)) {
			headers.append('Set-Cookie', event.cookies.serialize(cookie, value as string, { path: '/' }));
		}

		return new Response(JSON.stringify({ ok: true }), { headers });
	},
	'/__server__/unset-cookie': async (event) => {
		const cookies = await event.request.json();
		const headers = new Headers();

		for (const [cookie, value] of Object.entries(cookies)) {
			headers.append(
				'Set-Cookie',
				event.cookies.serialize(cookie, value as string, {
					path: '/',
					expires: new Date(0),
				})
			);
		}

		return new Response(JSON.stringify({ removed: true }), { headers });
	},
};
