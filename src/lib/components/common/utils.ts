import type { IconProps } from './icon/types.js';

export function icon(iconProp: IconProps | string): IconProps {
    if (typeof iconProp === 'string') {
        return { name: iconProp, size: 16 };
    }

    return iconProp;
}
