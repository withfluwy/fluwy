export type Listener = (args: any) => void;

class EventManager {
	private listeners: { [key: string]: Listener[] } = {};

	emit(event: string, args?: any) {
		const listeners = this.listeners[event];

		if (!listeners) return;

		for (const listener of listeners) {
			listener(args);
		}
	}

	on(event: string, callback: Listener) {
		this.listeners[event] ??= [];

		if (this.hasListener(event, callback)) return;

		this.listeners[event].push(callback);
	}

	hasListener(event: string, listener: Listener): boolean {
		return this.listeners[event]?.includes(listener) ?? false;
	}

	removeListener(event: string, callback: Listener) {
		if (!this.hasListener(event, callback)) return;

		const index = this.listeners[event].indexOf(callback);

		this.listeners[event].splice(index, 1);
	}

	refresh(id: string) {
		return `Refresh::${id}`;
	}

	pagination(id: string) {
		return `Pagination::${id}`;
	}

	paginate(id: string) {
		return `Paginate::${id}`;
	}
}

export function createEventManager() {
	return new EventManager();
}

export const Events = new EventManager();
