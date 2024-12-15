import type { Operation } from '@/lib/core/contracts.js';
import { useDialogs } from '../stores/dialogs.js';

export const close_dialog: Operation = () => {
    return useDialogs().closeLast();
};
