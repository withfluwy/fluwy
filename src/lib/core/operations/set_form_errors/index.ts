import type { FormState } from '@/lib/components/forms/form/types.js';
import type { Operation } from '@/lib/core/contracts.js';
import type { HttpResponse } from '@/lib/core/utils/response/index.js';

interface SetFormErrorsParams {
    if_response_status?: string;
}

export const set_form_errors: Operation = async (
    params: SetFormErrorsParams | undefined,
    { context, previousResult }
) => {
    const form: FormState = context.get('form');

    if (!form) throw new Error('Operation [set_form_errors] should be used in a form context');

    const response: HttpResponse = context.get('response');

    if (!response) throw new Error('Operation [set_form_errors] should be used after a response is set in the context');

    const statusToCheck = +(params?.if_response_status ?? '400');
    if (response.status !== statusToCheck) return previousResult;

    form.errors = response.data.errors;

    return previousResult;
};
