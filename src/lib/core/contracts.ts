import type { Context } from './context/index.js';

export { Client } from './client/index.js';
export type { ContextData } from './context/index.js';
export type { Context };

export interface AppConfig {
    pages: string;
    layouts: string;
    themes: string;
    error: (status: number, body: Any) => never;
    redirect: (status: number, location: string | URL) => never;
}

export interface Component<T = Any> {
    name: string;
    value: Any;
    schema: T;
}

export interface ElementProps {
    id?: string;
    class?: string;
    content?: Any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
export type Template = Any;
export type OperationSchema = Record<string, Any>;
export type Operations = OperationSchema | OperationSchema[];

export type RenderResponse = {
    content: Any;
    theme?: Any;
};

export interface Operation {
    (args: Any, context: Context, previousResult?: Any): Any;
}

export type AdapterData = { data: Any; context: Context };
export type Adapter = (data: AdapterData['data'], context: AdapterData['context']) => Promise<AdapterData>;

export type ValidationError = Record<string, string[]>;

export type SimpleResponse = {
    status: number;
    data?: Any;
    errors?: ValidationError;
};

export interface Plugin {
    name: string;

    operations?: Record<string, Operation>;
}
