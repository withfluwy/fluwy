import type { Any, Operation } from '../../contracts.js';
import { collapseObject, expandObject } from '../../utils/normalize-object/index.js';

export const extract: Operation = async (map: Record<string, string>, { previousResult }) => {
    const collapsedResult = collapseObject(previousResult);

    const extractedResult = {} as Any;

    for (const [key, value] of Object.entries(map)) {
        extractedResult[key] = collapsedResult[value];
    }

    return expandObject(extractedResult);
};
