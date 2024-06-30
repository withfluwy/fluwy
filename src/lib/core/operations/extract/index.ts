import type { Operation } from '../../contracts';
import { collapseObject, expandObject } from '../../utils/normalize-object';

export const extract: Operation = async (map: Record<string, string>, _, result) => {
	const collapsedResult = collapseObject(result);

	const extractedResult = {} as any;

	for (const [key, value] of Object.entries(map)) {
		extractedResult[key] = collapsedResult[value];
	}

	return expandObject(extractedResult);
};
