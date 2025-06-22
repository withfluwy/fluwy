import * as components from '@/components/index.js';
import { app, plugins } from './lib/index.js';
import { error, redirect } from '@sveltejs/kit';

app.config({ error, redirect }).plug({
    name: 'doc',
    plugins: [plugins.PayloadCMS],
    components,
    operations: {
        test_validate_input: async (params, { context }) => {
            const input = context.get('input');
            console.log('test_validate_input called', input);
            input.valid = false;
            input.value = 'something';
            return input;
        }
    }
});
