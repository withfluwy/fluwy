import type { Operation } from '../contracts.js';
import { Events } from '../utils/events/index.js';

export const emit: Operation = async (event: string) => {
    Events.emit(event);
};
