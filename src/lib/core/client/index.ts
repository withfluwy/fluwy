import { getContext } from 'svelte';
import type { Adapter, AdapterData, Any, Context, Operation } from '../contracts.js';
import { get } from '../utils/index.js';
import { mergeObjects } from '../utils/merge-objects/index.js';

type OperationName = string;
type OperationHandlers = {
    [event: OperationName]: Operation;
};
type Adapters = {
    [name: string]: Adapter;
};

export function useClient() {
    return client;
}

export function useTheme(key: string, defaultValue?: Any): Any {
    const theme: Any = getContext('theme');

    return get(theme, key, defaultValue);
}

export function mergeThemes(key: string, defaultValue: Any) {
    const theme: Any = getContext('theme');

    return mergeObjects(defaultValue, get(theme, key, defaultValue));
}

export class Client {
    private handlers: OperationHandlers = {};
    private adapters: Adapters = {};

    addAdapter(adapterName: string, adapter: Adapter) {
        if (this.adapters[adapter.name]) throw new Error(`Adapter already exists for [${adapter.name}]`);

        this.adapters[adapterName] = adapter;

        return this;
    }

    addOperation(operation: OperationName, handler: Operation) {
        if (this.handlers[operation]) return this;

        this.handlers[operation] = handler;

        return this;
    }

    async handleOperation(event: OperationName, args: Any, context: Context, previousResult: Any) {
        const handle = this.handlers[event];

        if (!handle) throw new Error(`No operation defined for [${event}]`);

        return handle(args, context, previousResult);
    }

    async handleOperations(operations: Any, context: Context, initialResults?: Any): Promise<Any> {
        let result = initialResults;

        if (!operations) return;
        if (typeof operations === 'string') return this.handleOperation(operations, {}, context, result);
        if (typeof operations !== 'object')
            throw new Error(`Invalid User Action document [${JSON.stringify(operations)}]`);

        if (Array.isArray(operations)) {
            for (const operation of operations) {
                if (typeof operation === 'string') return this.handleOperation(operation, {}, context, result);

                for (const [action, args] of Object.entries(operation)) {
                    result = await this.handleOperation(action, args, context, result);
                }
            }

            return result;
        }

        for (const [operation, args] of Object.entries(operations || {})) {
            result = await this.handleOperation(operation, args, context, result);
        }

        return result;
    }

    async handleAdapter(adapterName: string = '', data: Any, context: Context): Promise<AdapterData> {
        if (!adapterName) return { data, context };

        const adapter = this.adapters[adapterName];

        if (!adapter) throw new Error(`No adapter defined for [${adapterName}]`);

        return adapter(data, context);
    }
}

const client = new Client();
