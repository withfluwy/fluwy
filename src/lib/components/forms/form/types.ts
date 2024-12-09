import type { Any, ElementProps, Operations, OperationSchema, ValidationError } from '@/lib/core/contracts.js';

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
     * TODO: remove this? Do we need it?
     */
    url?: string;
    /**
     * The data to initialize the form with.
     */
    data?: Record<string, Any>;
    method?: 'POST' | 'GET' | 'DIALOG';
    context?: Record<string, string | undefined>;
    /**
     * Path to set the data from the context object. Defaults to "record".
     */
    data_path?: string;
    /**
     * Set of operations to run on form data before submitting it.
     */
    before_submit?: Operations;
    /**
     * Set of operations to run before initializing the form data.
     */
    before_init?: Operations;
    fields: Fields;
    /**
     * Path to the errors object from the response json data. Defaults to the root
     */
    errors?: ErrorsConfig;

    /**
     * Set of operations to run on form submission.
     */
    on_submit?: Operations;
}

export type Fields = { [field: string]: InputProps };

export type ErrorsConfig = {
    path?: string;
    adapter?: string;
};

export interface FormState {
    id: string;
    data: Record<string, Any>;
    errors: ValidationError;
}
