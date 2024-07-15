import { get, hasBrackets } from '../index.js';

export function parseUriParams(uri: string, record: Record<string, unknown>): string {
    const routeParams = uri.split('/').filter(hasBrackets);

    let newUri = uri;

    for (const param of routeParams) {
        const path = param.slice(1, -1);
        const value = get(record, path);

        newUri = newUri.replace(param, value as string);
    }

    return newUri;
}
