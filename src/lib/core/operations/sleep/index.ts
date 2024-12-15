import type { Operation } from '@/lib/core/contracts.js';
import { sleep as sleepUtil } from '@/lib/core/utils/index.js';

export const sleep: Operation = async (duration: string, { previousResult }) => {
    if (Number.isNaN(+duration)) {
        throw new Error(`Invalid parameter for [sleep] operation: ${duration}`);
    }

    await sleepUtil(+duration);

    return previousResult;
};
