import type { Any, Operation } from '@/lib/core/contracts.js';
import { Events } from '@/lib/core/utils/events/index.js';

type EmitParams = string | { event: string; payload: Any };

export const emit: Operation = async (params: EmitParams, _, previousResult) => {
    if (typeof params === 'string') {
        if (!params) {
            throw new Error('Event name is required');
        }

        Events.emit(params);
        return previousResult;
    }

    if (!params?.event) {
        throw new Error('Event name is required');
    }

    Events.emit(params.event, params.payload);

    return previousResult;
};
