import { useDialogs } from '../stores/dialogs.js';

export function close_dialog() {
    return useDialogs().closeLast();
}
