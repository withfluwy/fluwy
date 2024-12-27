import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ request }) => {
    const { email, password } = await request.json();

    if (email !== 'user@example.com' || password !== '123123') {
        return Response.json(
            {
                errors: {
                    email: ['Invalid email or password'],
                },
            },
            {
                status: 400,
            }
        );
    }

    return Response.json({
        token: 'success-token-1234567890',
    });
};
