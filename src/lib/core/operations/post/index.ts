import { useClient } from '@/lib/core/client/index.js';
import type { Operation, Operations } from '@/lib/core/contracts.js';
import { compile, hasPlaceholders } from '@/lib/core/utils/compile/index.js';
import { get } from '@/lib/core/utils/index.js';

export const post: Operation = async (param: PostParam, context) => {
    const parsedUrl = compile(param.url, context.data);

    if (hasPlaceholders(parsedUrl))
        throw new Error(`[post] operation has unresolved placeholders for param [url]: [${parsedUrl}]`);

    const data = compile(param.data, context.data);

    console.log('calling post with', { parsedUrl, data, context: context.data });
    const response = await context.fetch(parsedUrl, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (param.on_error) {
            // FIXME: How do I handle operations without the client? Should I pass the client as an arg?
            const result = await useClient().handleOperations(param.on_error, context, data);
            console.log('result from error', { result, data });
        }
        throw new Error(`POST operation for [${parsedUrl}] failed with status [${response.status}]`);
    }

    const body = await response.json();

    return typeof param !== 'string' && param.path ? get(body, param.path) : body;
};

type PostParam = {
    /**
     * The URL to fetch data from
     */
    url: string;
    /**
     * The data to send.
     */
    data: string;
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
