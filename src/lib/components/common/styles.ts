import { useTheme } from '@/lib/core/client/index.js';
import { cn, get } from '@/lib/core/utils/index.js';

const Common = {
    border_radius: {
        lg: 'rounded-2xl',
        md: 'rounded-xl',
        sm: 'rounded-lg',
    },
    border_color: 'border-gray-200 dark:border-gray-700',
    foreground_color: 'bg-gray-50 dark:bg-gray-800 backdrop-blur',
    background_color: 'bg-white dark:bg-black',
};

export function useCommon(key: string): string {
    return cn(get(Common, key, ''), useTheme(`common.${key}`));
}
