import type { Operation } from '../contracts';
import { useDialogs } from '../stores/dialogs';

export const open_dialog: Operation = (yamlDoc, context) => {
	return useDialogs().open(yamlDoc, context);
};
