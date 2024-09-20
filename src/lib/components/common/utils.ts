import type { IconProps } from './icon/types.js';

export function icon(iconProp: IconProps | string, defaults: Partial<IconProps> = {}): IconProps {
    if (typeof iconProp === 'string') {
        return { name: iconProp, size: 16, ...defaults };
    }

    return { ...iconProp, ...defaults };
}
