import { useTheme } from '@/lib/core/utils/index.js';
import type { Any } from '@/lib/core/contracts.js';
import { cn, get } from '@/lib/core/utils/index.js';
import { mergeObjects } from '@/lib/core/utils/merge-objects/index.js';

export const Common = {
    spinner: 'svg-spinners:90-ring-with-bg',
    delay: 100,
    debounce: 500,
    border_radius: {
        lg: 'rounded-xl',
        md: 'rounded-lg',
        sm: 'rounded-md',
    },
    border_color: 'border-neutral-200 dark:border-neutral-700',
    foreground_color: 'bg-black/5 dark:bg-white/10 backdrop-blur-sm',
    background_color: 'bg-white dark:bg-neutral-900',
};

export function useCommon(key: string) {
    const common = get(Common, key, '');
    const theme = useTheme(`common.${key}`);

    if (isObject(common) || isObject(theme)) {
        return mergeObjects(common, theme);
    }

    if (isNumber(common) || isNumber(theme)) {
        return theme ?? common;
    }

    if (isBoolean(common) || isBoolean(theme)) {
        return theme ?? common;
    }

    if (isString(common) || isString(theme)) {
        return cn(common, theme);
    }

    throw new Error(`Common type not supported for key [${key}]. Type: ${typeof (theme ?? common)}`);
}

function isObject(value: Any) {
    return typeof value === 'object' && value !== null;
}

const isNumber = (value: Any) => typeof value === 'number';
const isBoolean = (value: Any) => typeof value === 'boolean';
const isString = (value: Any) => typeof value === 'string';
