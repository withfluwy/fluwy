import type { Any, Operation } from '../../contracts.js';
import { compile } from '../../utils/compile/index.js';

type CookieValue = {
    value: string;
    /**
     * The number of seconds until the cookie expires. Defaults to 15 minutes
     */
    duration?: number | string;
    /**
     * Date in ISO 8601 format at which the cookie expires. Defaults to 15 minutes
     */
    expires_at?: string;
};

export const set_operation: Operation = async (
    cookie: Record<string, CookieValue | string>,
    { context, previousResult }
) => {
    const cookies: Record<string, CookieValue> = {};

    for (const [key, rawValue] of Object.entries(cookie)) {
        if (typeof rawValue === 'string') {
            const compiledValue = compile(rawValue, context.data);
            cookies[key] = { value: compiledValue };
        } else {
            const { value, ...options } = rawValue;
            const compiledValue = compile(value, context.data);
            const compiledOptions: Record<string, Any> = {};

            // Compile all string options
            for (const [optKey, optValue] of Object.entries(options)) {
                if (typeof optValue === 'string') {
                    compiledOptions[optKey] = compile(optValue, context.data);
                } else {
                    compiledOptions[optKey] = optValue;
                }
            }

            cookies[key] = { value: compiledValue, ...compiledOptions };
        }
    }

    await fetch('/__server__/set-cookie', {
        body: JSON.stringify(cookies),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return previousResult;
};

export const unset_operation: Operation = async (cookie: string, { previousResult }) => {
    await fetch('/__server__/unset-cookie', {
        body: JSON.stringify({ [cookie]: true }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return previousResult;
};

type ServerFunction = (event: Any) => Promise<Any>;

export const endpoints: Record<string, ServerFunction> = {
    '/__server__/set-cookie': async (event) => {
        const cookies = (await event.request.json()) as Record<string, CookieValue | string>;
        const headers = new Headers();

        for (const [cookie, incoming] of Object.entries(cookies)) {
            const cookieValue = typeof incoming === 'string' ? incoming : String(incoming.value);
            const options = { path: '/' };

            let expiresDate: Date | undefined;

            if (typeof incoming !== 'string') {
                if (incoming.expires_at) {
                    expiresDate = new Date(incoming.expires_at);
                } else if (incoming.duration) {
                    expiresDate = new Date();
                    const duration = incoming.duration;
                    expiresDate.setSeconds(expiresDate.getSeconds() + Number(duration));
                }
            }

            if (expiresDate) Object.assign(options, { expires: expiresDate });

            headers.append('Set-Cookie', event.cookies.serialize(cookie, cookieValue, options));
        }

        return new Response(JSON.stringify({ ok: true }), { headers });
    },
    '/__server__/unset-cookie': async (event) => {
        const cookies = await event.request.json();
        const headers = new Headers();

        for (const [cookie, value] of Object.entries(cookies)) {
            headers.append(
                'Set-Cookie',
                event.cookies.serialize(cookie, value as string, {
                    path: '/',
                    expires: new Date(0),
                })
            );
        }

        return new Response(JSON.stringify({ removed: true }), { headers });
    },
};
