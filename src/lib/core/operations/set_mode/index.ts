import { setMode } from 'mode-watcher';
import type { Operation } from '../../contracts.js';

type Mode = 'light' | 'dark' | 'system';
export const set_mode: Operation = (mode: Mode) => {
    setMode(mode);
};
