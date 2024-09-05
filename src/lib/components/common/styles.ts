import { useTheme } from '@/lib/core/client/index.js';

const Common = {
    border_color: 'border-gray-200 dark:border-gray-200/20',
};

export function useCommon(key: keyof typeof Common): string {
    return useTheme(key, Common[key]);
}
