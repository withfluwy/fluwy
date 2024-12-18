import type { Operation } from '@/lib/core/contracts.js';
import { compile } from '@/lib/core/utils/compile/index.js';

export const alert: Operation = async (message: string, { context, previousResult }) => {
    window.alert(compile(String(message), context.data));

    return previousResult;
};
