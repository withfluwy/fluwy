import type { Adapter, ValidationError } from '../contracts.js';

export const validations: Adapter = async (data: StrapiValidationResponse, context) => {
    const { error } = data;

    const errors: ValidationError = {};

    for (const { message, path } of error.details?.errors ?? []) {
        errors[path.join('.')] = [message];
    }

    return { data: errors, context };
};

interface StrapiValidationResponse {
    error: {
        details?: {
            errors: StrapiValidationError[];
        };
    };
}

type StrapiValidationError = {
    message: string;
    name: string; // usually 'ValidationError'
    path: string[];
};
