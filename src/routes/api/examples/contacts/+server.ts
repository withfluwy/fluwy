import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async () => {
    return Response.json(
        {
            errors: {
                firstName: ['First name is required'],
                lastName: ['Last name is required'],
                email: ['Email is required'],
                'address.line1': ['Address line 1 is required'],
                address: {
                    city: ['City is required'],
                    country: ['Country is required'],
                },
            },
        },
        {
            status: 400,
        }
    );
};
