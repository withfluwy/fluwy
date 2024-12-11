import type { Operation } from '@/lib/core/contracts.js';

export const clear_form_errors: Operation = (_, context, previousResult) => {
    const form = context.get('form');

    if (!form) throw new Error('Operation [clear_form_errors] should be used in a form context');

    form.errors = {};

    return previousResult;
};
