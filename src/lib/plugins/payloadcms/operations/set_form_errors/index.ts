import type { FormState } from '@/lib/components/forms/form/types.js';
import type { Operation, ValidationError } from '@/lib/core/contracts.js';
import type { HttpResponse } from '@/lib/core/utils/response/index.js';
import type { PayloadValidationError } from '@/lib/plugins/payloadcms/types.js';

/**
 * Set form errors from a payloadcms response
 */
export const set_form_errors: Operation = async (params: SetFormErrorsParams, { context, previousResult }) => {
    const form: FormState = context.get('form');

    if (!form) throw new Error('Operation [set_form_errors] should be used in a form context');

    const response: HttpResponse = context.get('response');

    if (!response) throw new Error('Operation [set_form_errors] should be used with a response context');

    const statusToCheck = +(params?.if_response_status ?? '400');

    if (response.status !== statusToCheck) return previousResult;

    const errors: ValidationError = {};
    const payloadResponseBody: { errors: PayloadValidationError[] } = response.data;

    payloadResponseBody.errors.forEach((validationError) => {
        validationError.data.errors.forEach((error) => {
            errors[error.path] = [error.message];
        });
    });

    form.errors = errors;

    return previousResult;
};

interface SetFormErrorsParams {
    if_response_status?: string;
}
