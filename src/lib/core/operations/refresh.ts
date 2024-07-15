import type { Operation } from '../contracts.js';
import { Events } from '../utils/events/index.js';

export const refresh: Operation = async (id: string, context) => {
    Events.emit(Events.refresh(id), context.data);
};
