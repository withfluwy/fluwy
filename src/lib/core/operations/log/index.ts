import type { Operation } from '@/lib/core/contracts.js';
import { compile } from '@/lib/core/utils/compile/index.js';

export const log: Operation = (params: string, { context, previousResult }) => {
    console.log(compile(params, context.data));

    return previousResult;
};
