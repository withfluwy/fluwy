import { useTheme } from '@/lib/core/client/index.js';
import { cn } from '@/lib/core/utils/index.js';

const Common = {
    border_color: 'border-gray-200 dark:border-gray-700/60',
    foreground_color: 'bg-gray-50 dark:bg-gray-800 backdrop-blur',
    background_color: 'bg-white dark:bg-gray-950',
};

export function useCommon(key: keyof typeof Common): string {
    return cn(Common[key] ?? '', useTheme(`common.${key}`));
}
