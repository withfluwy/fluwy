import type { Operation } from '@/lib/core/contracts.js';
import { get as getOperation, type GetParam } from '@/lib/core/operations/get/index.js';

type LoadParams = { [varName: string]: GetParam };

export const load: Operation = async (params: LoadParams, options) => {
    if (!params) throw new Error('Load operation requires parameters but none were provided');

    const promises = Object.entries(params).map(async ([varName, getParam]) => {
        const value = await getOperation(getParam, options);

        options.context.set(varName, value);
    });

    await Promise.all(promises);
};
