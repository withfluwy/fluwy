import type { Operation } from '../contracts.js';
import { compile, hasPlaceholders } from '../utils/compile/index.js';
import { get as getAt } from '../utils/index.js';

export const get: Operation = async (param: string | GetParam, { context: { data, fetch } }) => {
    const url = typeof param === 'string' ? param : param.from;
    const parsedParams = compile(url, data);

    if (hasPlaceholders(parsedParams)) throw new Error(`GET operation for [${url}] has unresolved placeholders`);

    const response = await fetch(parsedParams);

    if (!response.ok) throw new Error(`GET operation for [${url}] failed with status [${response.status}]`);

    const body = await response.json();

    return typeof param !== 'string' && param.path ? getAt(body, param.path) : body;
};

type GetParam = {
    /**
     * The URL to fetch data from
     */
    from: string;
    /**
     *
     */
    path?: string;
};
