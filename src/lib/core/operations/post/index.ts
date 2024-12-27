import type { Operation, Operations } from '@/lib/core/contracts.js';
import { abort } from '@/lib/core/utils/index.js';
import { compile, hasPlaceholders } from '@/lib/core/utils/compile/index.js';
import { buildHttpResponse } from '@/lib/core/utils/response/index.js';

export const post: Operation = async (param: PostParam, { context, app }) => {
    const parsedUrl = compile(param.url, context.data);

    if (hasPlaceholders(parsedUrl)) {
        throw new Error(`[post] operation has unresolved placeholders for param [url]: [${parsedUrl}]`);
    }

    const data = param.data ? compile(param.data, context.data) : undefined;
    const auth_token = context.get('auth_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (auth_token) headers['Authorization'] = `Bearer ${auth_token}`;

    const baseResponse = await fetch(parsedUrl, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        headers,
        credentials: 'include',
    });

    const response = await buildHttpResponse(baseResponse);

    context.set('response', response);

    if (!response.ok) {
        if (param.on_error) {
            await app.handleOperations(param.on_error, context, data);
            abort();
        }

        throw new Error(
            `POST operation for [${parsedUrl}] failed with status [${response.status}] and there's no operations set to handle the error. Did you forget to set the [on_error] parameter?`
        );
    }

    return response;
};

type PostParam = {
    /**
     * The URL to fetch data from
     */
    url: string;
    /**
     * The data to send.
     */
    data?: string;
    /**
     * The validation adapter to use.
     */
    validate_with?: string;
    /**
     * The operations to run if the request fails after validation or non-validation errors. For example, if the
     * adapter throws an error, the error will be sent to the `on_error` operations.
     */
    on_error?: Operations;
};
