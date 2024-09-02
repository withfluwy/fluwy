import { createApp, type App } from '$lib/core/app/index.js';
import { beforeEach, describe, expect, it } from 'vitest';

const button = `
button: Test
`;
const button2 = `
button:
    text: Another Test
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
                    text: 'Another Test',
                },
            });
        });
    });
});
