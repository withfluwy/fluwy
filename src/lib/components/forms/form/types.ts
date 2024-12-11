import type { Any, ElementProps, Operations, ValidationError } from '@/lib/core/contracts.js';

export interface InputProps {
    type?: 'text' | 'date' | 'number' | 'email' | 'password';
    placeholder?: string;
    label?: string;
    class?: string;
    icon?: string;
    value?: Any;
    errors?: string[];
    trailing_icon?: string;
    required?: boolean;
    disabled?: boolean;
    width_dynamic?: boolean;
    oninput?: (event: Event) => void;
}

export interface FormProps extends ElementProps {
    /**
     * The id of the form.
     */
    id?: string;
    /**
     * The data to initialize the form with.
     */
    data?: Record<string, Any>;
    method?: 'POST' | 'GET' | 'DIALOG';

    /**
     * Set of operations to run on form submission.
     */
    on_submit?: Operations;
}

export interface FormState {
    data: Record<string, Any>;
    errors: ValidationError;
}
