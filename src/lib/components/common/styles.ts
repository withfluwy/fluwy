import { useTheme } from '@/lib/core/client/index.js';
import { cn, get } from '@/lib/core/utils/index.js';

const Common = {
    border_radius: {
        lg: 'rounded-xl',
        md: 'rounded-lg',
        sm: 'rounded-md',
    },
    border_color: 'border-neutral-200 dark:border-neutral-700',
    foreground_color: 'bg-neutral-50 dark:bg-neutral-800 backdrop-blur',
    background_color: 'bg-white dark:bg-black',
};

export function useCommon(key: string): string {
    return cn(get(Common, key, ''), useTheme(`common.${key}`));
}
