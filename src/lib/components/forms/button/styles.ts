export const Variants = {
    filled: 'bg-color border border-color dark:border-color text-color-contrast enabled:hover:bg-color/90',
    outline:
        'border border-color dark:border-color text-color-700 dark:text-color enabled:bg-color/10 enabled:hover:bg-color/15 enabled:dark:hover:bg-color/20',
    ghost: 'bg-transparent border border-transparent dark:border-transparent text-color focus:ring-color-100 dark:focus:ring-color/15 shadow-none enabled:hover:bg-color-50 enabled:dark:hover:bg-color/15',
    link: 'bg-transparent underline decoration-color-500 enabled:hover:decoration-2 border-none p-0 h-auto text-color focus:ring-offset-0 shadow-none ring-0 focus:ring-0 outline-none focus:outline-none enabled:hover:underline',
};

export const Sizes = {
    sm: 'text-xs h-8 px-2 py-1',
    md: 'text-sm h-10 px-3 gap-2 py-1',
};

type SizeTypes = keyof typeof Sizes;

export const BorderRadius: Record<SizeTypes, string> = {
    sm: 'rounded-lg',
    md: 'rounded-lg',
};
