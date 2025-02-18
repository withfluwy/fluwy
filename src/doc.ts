import * as components from '@/components/index.js';
import { app, plugins } from './lib/index.js';
import { error, redirect } from '@sveltejs/kit';

app.config({ error, redirect }).plug({
    name: 'doc',
    plugins: [plugins.PayloadCMS],
    components,
});
