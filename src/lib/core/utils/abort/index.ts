import { AbortOperationError } from '@/lib/core/errors/index.js';

/**
 * Abort the operation with the given message
 * @param message The error message
 * @throws {AbortOperationError}
 */
export function abort(message?: string) {
    throw new AbortOperationError(message);
}
