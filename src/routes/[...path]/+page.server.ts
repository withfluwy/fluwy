import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { app } from '$lib/index.js';

export const load: PageServerLoad = async (event) => {
    app.config = {
        pages: 'src/app/pages',
        layouts: 'src/app/layouts',
        themes: 'src/app/themes',
        error,
        redirect,
    };
    return app.render(event.params.path, { auth_token: event.cookies.get('auth_token') });
};
