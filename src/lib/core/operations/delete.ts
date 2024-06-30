import type { Operation } from '../contracts';
import { compile, hasPlaceholders } from '../utils/compile';

export const deleteOperation: Operation = async (args: string, context) => {
	const url = compile(args, context.data);

	if (hasPlaceholders(url)) throw new Error(`DELETE URL still has unresolved placeholders [${url}]`);

	const response = await context.fetch(url, { method: 'DELETE' });

	if (response.status >= 400) {
		const responseData = await response.json();
		throw new Error(responseData);
	}
};
