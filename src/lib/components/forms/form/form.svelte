<script lang="ts">
    import { onDestroy, onMount, setContext } from 'svelte';
    import type { Any, ValidationError } from '@/lib/core/contracts.js';
    import { cn, get, Random } from '@/lib/core/utils/index.js';
    // import Input from './input.svelte';
    // import Checkbox from './checkbox.svelte';
    import type { FormProps, FormState } from './types.js';
    import { SubmitEvents } from '@/lib/core/operations/submit.js';
    import { compile, hasPlaceholders } from '@/lib/core/utils/compile/index.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { Render, useClient, createContext } from '@/lib/core/index.js';
    import { collapseObject } from '@/lib/core/utils/normalize-object/index.js';
    // import _ from 'lodash';
    import { setupContext, useContext } from '@/lib/core/context/index.js';

    // const { cloneDeep } = _;

    const { content, ...props }: FormProps = $props();

    const client = useClient();
    const context = createContext();
    const id = props.id ?? Random.id();

    /**
     * Forms should create its own context for its data and validation errors. This context will be accessible to all
     * child components.
     */
    setupContext(context);

    const form: FormState = $state({
        id,
        data: collapseObject(props.data ?? {}),
        errors: {} as ValidationError,
    });

    const data = $derived(form.data);
    const errors = $derived(form.errors);
    const method = $derived((props.method || 'POST') as 'POST' | 'GET' | 'DIALOG');

    context.set('form', form);

    // const failedValidationStatuses = [400, 422];
    // const successEvent = SubmitEvents.success(form.id);
    // const failureEvent = SubmitEvents.failure(form.id);
    // const submittedEvent = SubmitEvents.submitted(form.id);

    // onMount(async () => {
    //     Events.on(submittedEvent, onsubmit);

    //     if (props.before_init) form.data = await client.handleOperations(props.before_init, context, data);
    // });

    // onDestroy(() => {
    //     Events.removeListener(submittedEvent, onsubmit);
    // });

    async function onsubmit(event: SubmitEvent) {
        console.log('onsubmit called', event);
        event.preventDefault();

        if (props.on_submit) {
            console.log('context', context.data);
            form.data = await client.handleOperations(props.on_submit, context);
        }

        // if (!props.url) throw new Error('URL param is required when submitting a form.');

        // const url = compile(props.url, context.data);

        // if (hasPlaceholders(url)) {
        //     throw new Error('URL param has unresolved placeholders.');
        // }

        // let dataToSubmit = cloneDeep(data);

        // if (props.before_submit) {
        //     dataToSubmit = await client.handleOperations(props.before_submit, context, dataToSubmit);
        // }

        // const response = await context.fetch(url, {
        //     method,
        //     body: JSON.stringify(dataToSubmit),
        // });

        // const result = await response.json();
        // const { status } = response;

        // if (failedValidationStatuses.includes(response.status)) {
        //     const incoming = props.errors?.path ? get(result, props.errors.path) : result;

        //     const { data } = await client.handleAdapter(props.errors?.adapter, incoming, context);

        //     form.errors = data;

        //     return Events.emit(failureEvent, { status, data: result, errors: form.errors });
        // }

        // if (response.status >= 400) {
        //     return Events.emit(failureEvent, { status, data: result });
        // }

        // Events.emit(successEvent, result);
    }

    // const components: Record<string, Any> = {
    //     default: Input,
    //     checkbox: Checkbox,
    // };
</script>

<form {onsubmit} {method} class={cn('flex h-fit flex-col gap-3', props.class)} enctype="multipart/form-data">
    <!-- {#each Object.entries(props.fields) as [field, input]} -->
    <!-- <svelte:component
            this={components[input.type ?? 'default'] ?? components['default']}
            bind:value={data[field]}
            errors={errors[field]}
            props={input}
        /> -->
    <!-- {/each} -->
    <Render props={content} />
</form>
