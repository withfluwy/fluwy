import type { Operation } from '../contracts';
import { Events } from '../utils/events';

export const emit: Operation = async (event: string) => {
	Events.emit(event);
};
