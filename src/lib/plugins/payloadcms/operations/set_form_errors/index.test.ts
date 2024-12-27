import { describe, it, expect, beforeEach } from 'vitest';
import { set_form_errors } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import type { FormState } from '@/lib/components/forms/form/types.js';
import { buildHttpResponse } from '@/lib/core/utils/response/index.js';
import type { PayloadValidationError } from '@/lib/plugins/payloadcms/types.js';
import type { Application } from '@/lib/core/index.js';
import { createApp } from '@/lib/index.js';

describe('payloadcms.set_form_errors', () => {
    let context: Context;
    let form: FormState;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        app = createApp();
        form = {
            data: {},
            errors: {},
        };
        context.set('form', form);
    });

    it('should map PayloadCMS validation errors to form errors', async () => {
        const response = await buildHttpResponse(
            new Response(
                JSON.stringify({
                    errors: [
                        {
                            name: 'ValidationError',
                            message: 'Validation failed',
                            data: {
                                collection: 'users',
                                errors: [
                                    { message: 'Email is required', path: 'email' },
                                    { message: 'Password is too short', path: 'password' },
                                ],
                            },
                        } satisfies PayloadValidationError,
                    ],
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        );

        context.set('response', response);

        await set_form_errors(null, { context, app });

        expect(form.errors).toEqual({
            email: ['Email is required'],
            password: ['Password is too short'],
        });
    });

    it('should throw error when form context is missing', async () => {
        context.set('form', undefined);
        const response = new Response('{}', {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
        const httpResponse = await buildHttpResponse(response);
        context.set('response', httpResponse);

        await expect(set_form_errors(null, { context, app })).rejects.toThrow(
            'Operation [set_form_errors] should be used in a form context'
        );
    });

    it('should throw error when response context is missing', async () => {
        context.set('response', undefined);

        await expect(set_form_errors(null, { context, app })).rejects.toThrow(
            'Operation [set_form_errors] should be used with a response context'
        );
    });

    it('should skip error mapping when response status does not match if_response_status', async () => {
        const response = await buildHttpResponse(
            new Response(
                JSON.stringify({
                    errors: [
                        {
                            name: 'ValidationError',
                            message: 'Validation failed',
                            data: {
                                collection: 'users',
                                errors: [
                                    { message: 'Email is required', path: 'email' },
                                ],
                            },
                        } satisfies PayloadValidationError,
                    ],
                }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        );

        context.set('response', response);

        await set_form_errors({ if_response_status: '400' }, { context, app });

        expect(form.errors).toEqual({});
    });
});
