export const Variants = {
    default: 'bg-white border enabled:hover:bg-gray-100',
    filled: 'bg-color text-color-contrast enabled:hover:bg-color/90',
    outline: 'border border-color-500 text-color-700 enabled:bg-color/5 enabled:hover:bg-color/10',
    ghost: 'bg-transparent border border-transparent text-color shadow-none enabled:hover:bg-color-50',
    link: 'bg-transparent border-none text-color shadow-none enabled:hover:underline',
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
