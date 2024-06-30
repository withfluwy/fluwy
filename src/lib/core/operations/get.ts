import type { Operation } from '../contracts';
import { compile, hasPlaceholders } from '../utils/compile';
import { get as getAt } from '../utils';

export const get: Operation = async (param: string | GetParam, { data, fetch }) => {
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
