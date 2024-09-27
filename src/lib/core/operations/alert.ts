import type { Operation } from '../contracts.js';

export const alert: Operation = (message: string) => {
    window.alert(message);
};
