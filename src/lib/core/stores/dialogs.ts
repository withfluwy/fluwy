import { get, writable } from 'svelte/store';
import type { Any } from '../contracts';
import { Random } from '../utils';
import { Events } from '../utils/events';

export const dialogs = writable<Dialog[]>([]);

export const DialogEvents = {
	CLOSE: 'Dialog::close_dialog',
};

export function useDialogs() {
	const { subscribe, update } = dialogs;

	return {
		subscribe,

		async open(doc: Any, context: Any = undefined) {
			const keys = Object.keys(doc);

			if (keys.length > 1) throw new Error('Dialogs must have only one root element');

			const firstKey = keys[0];
			const dialog: Dialog = {
				...doc[firstKey],
				component: firstKey,
				context,
				id: doc[firstKey].id ?? Random.id(),
			};

			update((dialogs) => [...dialogs, dialog]);

			return new Promise((resolve) => (dialog.resolve = resolve));
		},

		remove: (id: string) => {
			const dialog = get(dialogs).find((dialog) => dialog.id === id);
			if (!dialog) throw new Error(`Dialog [${id}] not found`);

			dialog.resolve();

			update((dialogs) => dialogs.filter((dialog) => dialog.id !== id));
		},

		closeLast() {
			const lastDialog: Dialog = get(dialogs).slice(-1)[0];

			if (!lastDialog) throw new Error('No dialogs to close');

			Events.emit(DialogEvents.CLOSE, lastDialog.id);
		},
	};
}

interface Dialog {
	id: string;
	component: string;
	context?: Any;
	resolve: (value?: Any) => void;
	[key: string]: Any;
}
