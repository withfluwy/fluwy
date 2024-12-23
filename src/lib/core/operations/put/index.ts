import { app } from '@/lib/index.js';
import type { Operation, Operations } from '@/lib/core/contracts.js';
import { abort } from '@/lib/core/operations/utils.js';
import { compile, hasPlaceholders } from '@/lib/core/utils/compile/index.js';
import { buildHttpResponse } from '@/lib/core/utils/response/index.js';

export const put: Operation = async (param: PutParam, { context }) => {
    const parsedUrl = compile(param.url, context.data);

    if (hasPlaceholders(parsedUrl)) {
        throw new Error(`[put] operation has unresolved placeholders for param [url]: [${parsedUrl}]`);
    }

    const data = param.data ? compile(param.data, context.data) : undefined;

    const baseResponse = await context.fetch(parsedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
    });

    const response = await buildHttpResponse(baseResponse);

    context.set('response', response);

    if (!response.ok) {
        if (param.on_error) {
            await app.handleOperations(param.on_error, context, data);
            return abort();
        }

        throw new Error(
            `PUT operation for [${parsedUrl}] failed with status [${response.status}] and there's no operations set to handle the error. Did you forget to set the [on_error] parameter?`
        );
    }

    return response;
};

type PutParam = {
    /**
     * The URL to send the PUT request to
     */
    url: string;
    /**
     * The data to send in the request body. This should be a string that will be compiled
     * using the context data. For example: 'form.data' will be compiled to the actual form data.
     */
    data?: string;
    /**
     * The operations to run if the request fails (status >= 400).
     * These operations will receive the context and data as parameters.
     * After running these operations, the put operation will abort.
     */
    on_error?: Operations;
};
