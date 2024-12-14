import { getContext } from 'svelte';
import type { Adapter, AdapterData, Any, Context, Operation, Plugin } from '../contracts.js';
import { get, str } from '../utils/index.js';
import { mergeObjects } from '../utils/merge-objects/index.js';
import { AbortOperation } from '@/lib/core/operations/utils.js';

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

    plug(plugin: Plugin): this {
        for (const [operationName, operationHandler] of Object.entries(plugin.operations ?? {})) {
            const normalizedOperationName = str(operationName).snakeCase();
            this.addOperation(`${plugin.name}.${normalizedOperationName}`, operationHandler);
        }

        return this;
    }

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

        if (!handle) throw new Error(`Operation [${event}] not found`);

        return handle(args, context, previousResult);
    }

    async handleOperations(operations: Any, context: Context, initialResults?: Any): Promise<Any> {
        let result = initialResults;

        if (!operations) return;

        try {
            if (typeof operations === 'string') return await this.handleOperation(operations, {}, context, result);
            if (typeof operations !== 'object')
                throw new Error(`Invalid User Action document [${JSON.stringify(operations)}]`);

            if (Array.isArray(operations)) {
                for (const operation of operations) {
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
        } catch (error) {
            if (error instanceof AbortOperation) return;

            throw error;
        }
    }

    async handleAdapter(adapterName: string = '', data: Any, context: Context): Promise<AdapterData> {
        if (!adapterName) return { data, context };

        const adapter = this.adapters[adapterName];

        if (!adapter) throw new Error(`No adapter defined for [${adapterName}]`);

        return adapter(data, context);
    }
}

const client = new Client();
