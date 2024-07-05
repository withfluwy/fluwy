import { createApp, type App } from '$lib/core/app/index.js';
import { beforeEach, describe, expect, it } from 'vitest';

const button = `
button: Test
`;
const button2 = `
button:
    text: Another Test
`;

const theme = `
button:
  filled:
    default: bg-red-500 border text-gray enabled:hover:bg-gray-100
    primary: bg-primary text-primary-foreground enabled:hover:bg-primary/90
    danger: bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90
    success: bg-green-500 text-white enabled:hover:bg-green-500/90
    warning: bg-yellow-500 text-white enabled:hover:bg-yellow-500/90
    info: bg-blue-400 text-white enabled:hover:bg-blue-400/90
    gray: bg-gray-400 text-white enabled:hover:bg-gray-400/90
`;

describe('button component', () => {
	let app: App;

	beforeEach(() => {
		app = createApp();
	});

	describe('.parseDocument', () => {
		it('should parse', async () => {
			expect(await app.parseDocument(button)).toEqual({ button: 'Test' });
			expect(await app.parseDocument(button2)).toEqual({
				button: {
					text: 'Another Test'
				}
			});
		});
	});
});
