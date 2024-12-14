export class AbortOperation extends Error {}

/**
 * Abort the operation with the given message
 * @param message The error message
 * @throws {AbortOperation}
 */
export function abort(message?: string) {
    throw new AbortOperation(message);
}
