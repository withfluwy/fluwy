import { useClient } from '../client';
import type { Any, Operation, OperationSchema, SimpleResponse } from '../contracts';
import { Events } from '../utils/events';

export const SubmitEvents = {
	submitted: (id: string) => `Submit::${id}`,
	success: (id: string) => `Submit::${id}.success`,
	failure: (id: string) => `Submit::${id}.failure`,
};

export const submit: Operation = async (param: string | SubmitParam, context) => {
	const form = typeof param === 'string' ? param : param.form;
	const on_error = typeof param === 'string' ? undefined : param.on_error;
	const client = useClient();
	let resolve: (value: Any) => void;
	let reject: (error: Any) => void;

	const submittedEvent = SubmitEvents.submitted(form);
	const successEvent = SubmitEvents.success(form);
	const failureEvent = SubmitEvents.failure(form);

	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	const onSuccess = (payload: Any) => {
		context.set('response', payload);
		resolve(payload);
		stopListening();
	};

	const onFailure = async (response: SimpleResponse) => {
		context.set('response', response.data);
		const hasValidationErrors = Object.keys(response.errors || {}).length > 0;

		if (!hasValidationErrors && on_error) {
			await client.handleOperations(on_error, context, response.data);
		}

		reject(response);
		stopListening();
	};

	const stopListening = () => {
		Events.removeListener(successEvent, onSuccess);
		Events.removeListener(failureEvent, onFailure);
	};

	const startListening = () => {
		Events.on(successEvent, onSuccess);
		Events.on(failureEvent, onFailure);
	};

	startListening();

	Events.emit(submittedEvent);

	return promise;
};

type SubmitParam = {
	form: string;
	on_error?: OperationSchema;
};
