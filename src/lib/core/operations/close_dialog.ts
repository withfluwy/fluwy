import { useDialogs } from '../stores/dialogs';

export function close_dialog() {
	return useDialogs().closeLast();
}
