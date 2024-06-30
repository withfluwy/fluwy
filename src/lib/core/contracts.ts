import type { Context } from './context';

export { Client } from './client';
export type { ContextData, RawContextData } from './context';
export type { Context };

export interface Component<T = Any> {
	name: string;
	value: Any;
	schema: T;
}

export interface ElementProps {
	class?: string;
	body: Any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
export type OperationSchema = Record<string, Any>;

export type RenderResponse = {
	content: Any;
};

export interface Operation {
	(args: Any, context: Context, previousResult?: any): Any;
}

export type AdapterData = { data: any; context: Context };
export type Adapter = (
	data: AdapterData['data'],
	context: AdapterData['context']
) => Promise<AdapterData>;

export type ValidationError = Record<string, string[]>;

export type SimpleResponse = {
	status: number;
	data?: any;
	errors?: ValidationError;
};
