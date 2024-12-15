import type { Operation } from '../../contracts.js';

export const wrap_into: Operation = async (wrapper: string, { previousResult }) => {
    return {
        [wrapper]: previousResult,
    };
};
