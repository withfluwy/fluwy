import type { Operation } from '../contracts';
import { Events } from '../utils/events';

export const refresh: Operation = async (id: string, context) => {
	Events.emit(Events.refresh(id), context.data);
};
