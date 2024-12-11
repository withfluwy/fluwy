import { describe, it, expect, beforeEach } from 'vitest';
import { set_form_errors } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import type { FormState } from '@/lib/components/forms/form/types.js';
import { HttpResponse } from '@/lib/core/utils/response/index.js';
import type { PayloadValidationError } from '@/lib/plugins/payloadcms/types.js';

describe('payloadcms.set_form_errors', () => {
    let context: Context;
    let form: FormState;

    beforeEach(() => {
        context = createContext();
        form = {
            data: {},
            errors: {},
        };
        context.set('form', form);
    });

    it('should map PayloadCMS validation errors to form errors', async () => {
        const response = new HttpResponse(
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
                headers: { 'Content-Type': 'application/json' },
            }
        );

        context.set('response', response);
        await response.asyncJson();

        await set_form_errors(null, context);

        expect(form.errors).toEqual({
            email: ['Email is required'],
            password: ['Password is too short'],
        });
    });

    it('should throw error when form context is missing', async () => {
        context.set('form', undefined);
        const response = new HttpResponse('{}', {
            headers: { 'Content-Type': 'application/json' },
        });
        context.set('response', response);
        await response.asyncJson();

        await expect(set_form_errors(null, context)).rejects.toThrow(
            'Operation [set_form_errors] should be used in a form context'
        );
    });

    it('should throw error when response context is missing', async () => {
        context.set('response', undefined);

        await expect(set_form_errors(null, context)).rejects.toThrow(
            'Operation [set_form_errors] should be used with a response context'
        );
    });
});
