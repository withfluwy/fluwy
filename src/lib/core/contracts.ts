import type { Component as SvelteComponent } from 'svelte';
import type { Context } from './context/index.js';
import type { Application } from '@/lib/core/app/index.js';

export type { ContextData } from './context/index.js';
export type { Context };
export type { FormState } from '@/lib/components/forms/form/types.js';

export interface AppConfig {
    /**
     * The path to the pages directory
     */
    pages: string;
    /**
     * The path to the layouts directory
     */
    layouts: string;
    /**
     * The path to the themes directory
     */
    themes: string;
    /**
     * SvelteKit's `error` function. Should be injected in the app initialization. I can't be bundled with the lib.
     */
    error: (status: number, body: Any) => never;
    /**
     * SvelteKit's `redirect` function. Should be injected in the app initialization. I can't be bundled with the lib.
     */
    redirect: (status: number, location: string | URL) => never;
}
export type RequiredAppConfig = Pick<AppConfig, 'error' | 'redirect'> & Partial<Omit<AppConfig, 'error' | 'redirect'>>;

export interface Component<T = Any> {
    name: string;
    value: Any;
    schema: T;
}

export interface ElementProps {
    id?: string;
    class?: string;
    content?: Template;
    [key: string]: Template;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
export type Template = Any;
export type OperationSchema = Record<string, Any>;
export type Operations = OperationSchema | OperationSchema[];

export type RenderResponse = {
    content: Any;
    theme?: Any;
    /**
     * The initial data of the context from the backend.
     */
    context?: Any;
};

export interface OperationOptions {
    context: Context;
    previousResult?: Any;
    app: Application;
}

export interface Operation {
    (args: Any, options: OperationOptions): Any;
}
export type OperationHandlers = {
    [event: string]: Operation;
};

export type AdapterData = { data: Any; context: Context };
export type Adapter = (data: AdapterData['data'], context: AdapterData['context']) => Promise<AdapterData>;
export type Adapters = {
    [name: string]: Adapter;
};

export type ValidationError = Record<string, string[]>;

export type SimpleResponse = {
    status: number;
    data?: Any;
    errors?: ValidationError;
};

export interface Plugin {
    /**
     * The name of the plugin. This will be used as the prefix for the plugin's features. Recommended to use snake_case
     * format to be consistent with other plugins and the rest of the framework.
     */
    name: string;

    /**
     * The operations provided by the plugin
     */
    operations?: Record<string, Operation>;

    /**
     * The components provided by the plugin
     */
    components?: Record<string, SvelteComponent>;

    /**
     * The plugins required by the plugin
     */
    plugins?: Plugin[];
}
