import { expect, describe, it, beforeEach } from 'vitest';
import { set_form_errors } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import type { Any } from '@/lib/core/contracts.js';
import type { HttpResponse } from '@/lib/core/utils/response/index.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';

describe('set_form_errors', () => {
    let context: Context;
    let previousResult: Any;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        app = createApp();
        previousResult = 'previousResult';
    });

    it('should throw error when form context is not present', async () => {
        await expect(set_form_errors(undefined, { context, previousResult, app })).rejects.toThrow(
            'Operation [set_form_errors] should be used in a form context'
        );
    });

    it('should throw error when response is not present in context', async () => {
        const form = { errors: {} };
        context.set('form', form);

        await expect(set_form_errors(undefined, { context, previousResult, app })).rejects.toThrow(
            'Operation [set_form_errors] should be used after a response is set in the context'
        );
    });

    it('should set form errors from response data with default status (400)', async () => {
        const form = { errors: {} };
        const response = {
            status: 400,
            data: {
                errors: {
                    field1: 'error1',
                    field2: 'error2',
                },
            },
        } as HttpResponse;

        context.set('form', form);
        context.set('response', response);

        const result = await set_form_errors(undefined, { context, previousResult, app });

        expect(result).toBe(previousResult);
        expect(form.errors).toEqual(response.data.errors);
    });

    it('should set form errors when response status matches custom if_response_status', async () => {
        const form = { errors: {} };
        const response = {
            status: 422,
            data: {
                errors: {
                    field1: 'error1',
                },
            },
        } as HttpResponse;

        context.set('form', form);
        context.set('response', response);

        const result = await set_form_errors({ if_response_status: '422' }, { context, previousResult, app });

        expect(result).toBe(previousResult);
        expect(form.errors).toEqual(response.data.errors);
    });

    it('should return previous results when response status does not match if_response_status', async () => {
        const form = { errors: {} };
        const response = {
            status: 500,
            data: {
                errors: {
                    field1: 'error1',
                },
            },
        } as HttpResponse;

        context.set('form', form);
        context.set('response', response);

        const result = await set_form_errors({ if_response_status: '422' }, { context, previousResult, app });

        expect(result).toBe(previousResult);
        expect(form.errors).toEqual({});
    });
});
