export interface PayloadValidationError {
    name: 'ValidationError';
    message: string;
    data: {
        collection: string;
        errors: PayloadErrorMessage[];
    };
}

export interface PayloadErrorMessage {
    message: string;
    path: string;
}
