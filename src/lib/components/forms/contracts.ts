import type { Any, Template } from '@/lib/core/contracts.js';

export interface InputProps {
    type?: 'text' | 'date' | 'number' | 'email' | 'password' | 'search';
    placeholder?: string;
    label?: Template;
    /**
     * The description of the input that will be displayed below the input.
     */
    description?: Template;
    class?: string;
    icon?: string;
    /**
     * The size of the input. Options: 'sm', 'md', 'lg', and any custom value for the theme.
     * @default 'md'
     */
    size?: string;
    value?: Any;
    /**
     * The errors of the input that will be displayed below the input.
     */
    errors?: string[];
    /**
     * The trailing icon of the input that will be displayed on the right side of the input.
     */
    trailing_icon?: string;
    required?: boolean;
    disabled?: boolean;
    width_dynamic?: boolean;
    loading?: boolean;
    oninput?: (event: Event) => void;
}
