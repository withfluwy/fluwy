import type { Any } from '@/lib/core/contracts.js';
import type { PaginationPayload, Paginate } from '@/lib/components/displays/table/types.js';

export type Listener = (args: Any) => void;

class EventManager {
    private listeners: { [key: string]: Listener[] } = {};

    public markdownReady = 'MarkdownReady';

    emit(event: string, args?: Any) {
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

    tableFetching(id: string) {
        return `TableFetching::${id}`;
    }

    paginate(id: string) {
        return `Paginate::${id}`;
    }

    toggleSidebar() {
        return 'ToggleSidebar';
    }

    dispatchPagination(id: string, payload: PaginationPayload) {
        this.emit(this.pagination(id), payload);
    }

    dispatchPaginate(id: string, payload: Paginate) {
        this.emit(this.paginate(id), payload);
    }

    dispatchTableFetching(id: string, value: boolean) {
        this.emit(this.tableFetching(id), value);
    }
}

export function createEventManager() {
    return new EventManager();
}

export const Events = new EventManager();
