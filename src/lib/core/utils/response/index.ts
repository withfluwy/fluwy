import type { Any } from '@/lib/core/contracts.js';

export interface HttpResponse {
    data?: Any;
    status: number;
    statusText: string;
    headers: Headers;
    bodyUsed: boolean;
    type: string;
    url: string;
    redirected: boolean;
    ok: boolean;
    text?: string;
}

export async function buildHttpResponse(response: Response): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        bodyUsed: response.bodyUsed,
        type: response.type,
        url: response.url,
        redirected: response.redirected,
        ok: response.ok,
    };

    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
        httpResponse.data = await response.json();
    } else {
        httpResponse.text = await response.text();
    }

    return httpResponse;
}
