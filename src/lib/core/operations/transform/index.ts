import type { Operation } from '../../contracts';
import { collapseObject } from '../../utils/normalize-object';

type TransformMapSchema = Record<string, string>;

export const transform: Operation = async (map: TransformMapSchema, _, result) => {
	const collapsedResult = collapseObject(result);
	validateMap(map);

	const transformedResult: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(map)) {
		transformedResult[value] = collapsedResult[key];
	}

	return transformedResult;
};

function validateMap(map: TransformMapSchema) {
	const allValuesAreStrings = Object.values(map).every((value) => typeof value === 'string');

	if (!allValuesAreStrings) throw new Error('Values in the map must be strings');
}
