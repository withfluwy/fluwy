<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Any, ValidationError } from '../core/contracts';
	import { cn, get } from '../core/utils';
	import Input from './input.svelte';
	import Checkbox from './checkbox.svelte';
	import type { FormProps } from './types';
	import { SubmitEvents } from '../core/operations/submit';
	import { compile, hasPlaceholders } from '../core/utils/compile';
	import { Events } from '../core/utils/events';
	import { useClient, useContext } from '../core';
	import { collapseObject } from '../core/utils/normalize-object';
	import _ from 'lodash';

	const { cloneDeep } = _;

	export let props: FormProps;

	const context = useContext();
	const client = useClient();

	let data: Record<string, Any> = collapseObject(context.get(props.data_path ?? 'record') || {});
	let errors: ValidationError = {};

	const failedValidationStatuses = [400, 422];
	const successEvent = SubmitEvents.success(props.id);
	const failureEvent = SubmitEvents.failure(props.id);
	const submittedEvent = SubmitEvents.submitted(props.id);

	$: method = (props.method || 'POST').toUpperCase();

	onMount(async () => {
		Events.on(submittedEvent, onsubmit);

		if (props.before_init) data = await client.handleOperations(props.before_init, context, data);
	});

	onDestroy(() => {
		Events.removeListener(submittedEvent, onsubmit);
	});

	async function onsubmit() {
		if (!props.url) throw new Error('URL param is required when submitting a form.');

		const url = compile(props.url, context.data);

		if (hasPlaceholders(url)) {
			throw new Error('URL param has unresolved placeholders.');
		}

		let dataToSubmit = cloneDeep(data);

		if (props.before_submit) {
			dataToSubmit = await client.handleOperations(props.before_submit, context, dataToSubmit);
		}

		const response = await context.fetch(url, {
			method,
			body: JSON.stringify(dataToSubmit),
		});

		const result = await response.json();
		const { status } = response;

		if (failedValidationStatuses.includes(response.status)) {
			const incoming = props.errors?.path ? get(result, props.errors.path) : result;

			const { data } = await client.handleAdapter(props.errors?.adapter, incoming, context);

			errors = data;

			return Events.emit(failureEvent, { status, data: result, errors });
		}

		if (response.status >= 400) {
			return Events.emit(failureEvent, { status, data: result });
		}

		Events.emit(successEvent, result);
	}

	const components: Record<string, Any> = {
		default: Input,
		checkbox: Checkbox,
	};
</script>

<form class={cn('flex flex-col gap-3', props.class)} enctype="multipart/form-data">
	{#each Object.entries(props.fields) as [field, input]}
		<svelte:component
			this={components[input.type ?? 'default'] ?? components['default']}
			bind:value={data[field]}
			errors={errors[field]}
			props={input}
		/>
	{/each}
</form>
