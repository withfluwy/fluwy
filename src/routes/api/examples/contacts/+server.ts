import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async () => {
    return Response.json(
        {
            errors: {
                firstName: ['First name is required'],
                lastName: ['Last name is required'],
                email: ['Email is required'],
            },
        },
        {
            status: 400,
        }
    );
};
