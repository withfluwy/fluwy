import { expect, describe, it, beforeEach } from 'vitest';
import { clear_form_errors } from './index.js';
import { createContext, type Context } from '@/lib/core/context/index.js';
import type { Any } from '@/lib/core/contracts.js';
import type { Application } from '@/lib/core/app/index.js';
import { createApp } from '@/lib/index.js';

describe('clear_form_errors', () => {
    let context: Context;
    let previousResult: Any;
    let app: Application;

    beforeEach(() => {
        context = createContext();
        previousResult = 'previousResult';
        app = createApp();
    });

    it('should throw error when form context is not present', () => {
        expect(() => clear_form_errors(null, { context, previousResult, app })).toThrow(
            'Operation [clear_form_errors] should be used in a form context'
        );
    });

    it('should clear form errors when form context is present', () => {
        const form = { errors: { field1: 'error1', field2: 'error2' } };
        context.set('form', form);

        const result = clear_form_errors(null, { context, previousResult, app });

        expect(result).toBe(previousResult);
        expect(form.errors).toEqual({});
    });
});
