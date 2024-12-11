import type { Any } from '@/lib/core/contracts.js';

export class HttpResponse extends Response {
    private _cacheJson: Any;
    private _parsedJson: boolean = false;

    static async fromResponse(response: Response) {
        const httpResponse = new HttpResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });

        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
            await httpResponse.asyncJson();
        }

        return httpResponse;
    }

    get data() {
        return this._cacheJson;
    }

    async asyncJson() {
        if (this._parsedJson) return this._cacheJson;

        const contentType = this.headers.get('Content-Type');
        if (!contentType?.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        this._cacheJson = await super.json();
        this._parsedJson = true;

        return this._cacheJson;
    }
}
