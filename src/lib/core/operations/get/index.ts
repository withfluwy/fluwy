import { buildHttpResponse } from '@/lib/core/utils/response/index.js';
import type { Operation, Operations } from '../../contracts.js';
import { compile, hasPlaceholders } from '../../utils/compile/index.js';
import { get as getAt } from '../../utils/index.js';
import { app } from '@/lib/core/app/index.js';
import { abort } from '@/lib/core/operations/utils.js';

export const get: Operation = async (param: GetParam, { context }) => {
    const url = typeof param === 'string' ? param : param.url;
    const parsedUrl = compile(url, context.data);

    if (hasPlaceholders(parsedUrl)) {
        throw new Error(`[get] operation has unresolved placeholders for param [url]: [${parsedUrl}]`);
    }

    const baseResponse = await context.fetch(parsedUrl, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    const response = await buildHttpResponse(baseResponse);

    context.set('response', response);

    if (!response.ok) {
        if (param.on_error) {
            await app.handleOperations(param.on_error, context, context.data);
            abort();
        }

        throw new Error(
            `GET operation for [${parsedUrl}] failed with status [${response.status}] and there's no operations set to handle the error. Did you forget to set the [on_error] parameter?`
        );
    }

    return typeof param !== 'string' && param.path ? getAt(response.data, param.path) : response.data;
};

export type GetParam = {
    /**
     * The URL to fetch data from
     */
    url: string;
    /**
     *
     */
    path?: string;
    /**
     * Operations to run if the GET operation fails
     */
    on_error?: Operations;
};
