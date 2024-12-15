import type { Operation } from '../contracts.js';
import { useDialogs } from '../stores/dialogs.js';

export const open_dialog: Operation = (yamlDoc, { context }) => {
    return useDialogs().open(yamlDoc, context);
};
