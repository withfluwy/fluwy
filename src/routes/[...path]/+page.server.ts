import type { PageServerLoad } from './$types.js';
import { app } from '$lib/index.js';

export const load: PageServerLoad = async (event) => {
	app.config = {
		components: 'src/app/components',
		pages: 'src/app/pages',
		layouts: 'src/app/layouts'
	};
	return app.render(event.params.path, { auth_token: event.cookies.get('auth_token') });
};
