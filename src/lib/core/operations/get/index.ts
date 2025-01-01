import { buildHttpResponse } from '@/lib/core/utils/response/index.js';
import type { Operation, Operations } from '../../contracts.js';
import { compile, hasPlaceholders } from '../../utils/compile/index.js';
import { get as getAt } from '../../utils/index.js';
import { abort } from '@/lib/core/utils/index.js';
import { error } from '@sveltejs/kit';

export const get: Operation = async (param: GetParam, { context, app }) => {
    const url = typeof param === 'string' ? param : param.url;
    const parsedUrl = compile(url, context.data);

    if (hasPlaceholders(parsedUrl)) {
        throw new Error(`[get] operation has unresolved placeholders for param [url]: [${parsedUrl}]`);
    }

    const auth_token = context.get('auth_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (auth_token) headers['Authorization'] = `Bearer ${auth_token}`;

    const baseResponse = await fetch(parsedUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
    });
    const response = await buildHttpResponse(baseResponse);

    context.set('response', response);

    // TODO(http.get): Add tests for the 404
    if (response.status === 404) {
        error(404, 'Not Found');
    }

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
