import type { Operation } from '../../contracts.js';

export const wrap_into: Operation = async (wrapper: string, _, result) => {
    return {
        [wrapper]: result,
    };
};
