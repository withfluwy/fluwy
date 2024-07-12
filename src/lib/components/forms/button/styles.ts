export const Variants = {
    filled: 'bg-color border border-color text-color-contrast enabled:hover:bg-color/90',
    outline: 'border border-color-500 text-color-700 enabled:bg-color/5 enabled:hover:bg-color/10',
    ghost: 'bg-transparent border border-transparent text-color shadow-none enabled:hover:bg-color-50',
    link: 'bg-transparent border-none p-0 h-auto text-color focus:ring-offset-0 shadow-none ring-0 focus:ring-0 outline-none focus:outline-none enabled:hover:underline',
};

export const Sizes = {
    sm: 'text-xs h-8 px-2',
    md: 'text-sm h-10 px-3 gap-2',
};

type SizeTypes = keyof typeof Sizes;

export const BorderRadius: Record<SizeTypes, string> = {
    sm: 'rounded-lg',
    md: 'rounded-lg',
};
