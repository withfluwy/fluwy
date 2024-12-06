<script lang="ts">
    import { onDestroy, onMount, setContext } from 'svelte';
    import type { Any, ValidationError } from '@/lib/core/contracts.js';
    import { cn, get } from '@/lib/core/utils/index.js';
    // import Input from './input.svelte';
    // import Checkbox from './checkbox.svelte';
    import type { FormProps, FormState } from './types.js';
    import { SubmitEvents } from '@/lib/core/operations/submit.js';
    import { compile, hasPlaceholders } from '@/lib/core/utils/compile/index.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { Render, useClient, createContext } from '@/lib/core/index.js';
    import { collapseObject } from '@/lib/core/utils/normalize-object/index.js';
    import _ from 'lodash';
    import { setupContext, useContext } from '@/lib/core/context/index.js';

    const { cloneDeep } = _;

    const { content, ...props }: FormProps = $props();

    const client = useClient();
    const context = useContext();

    // let data: Record<string, Any> = collapseObject(context.get(props.data_path ?? 'record') || {});
    // let data = $state(context.get('data'));
    // let data = $state(collapseObject(props.data ?? {}));
    // let errors: ValidationError = {};
    // const form = () => data;

    const form: FormState = $state({
        data: collapseObject(props.data ?? {}),
        errors: {} as ValidationError,
    });

    setContext('form', form);

    // TODO: work on the form context
    $effect(() => {
        console.log('form.data changes in form', form.data);
    });

    // const failedValidationStatuses = [400, 422];
    // const successEvent = SubmitEvents.success(props.id);
    // const failureEvent = SubmitEvents.failure(props.id);
    // const submittedEvent = SubmitEvents.submitted(props.id);

    // const method = $derived((props.method || 'POST').toUpperCase());

    // onMount(async () => {
    //     Events.on(submittedEvent, onsubmit);

    //     if (props.before_init) data = await client.handleOperations(props.before_init, context, data);
    // });

    // onDestroy(() => {
    //     Events.removeListener(submittedEvent, onsubmit);
    // });

    // async function onsubmit() {
    //     if (!props.url) throw new Error('URL param is required when submitting a form.');

    //     const url = compile(props.url, context.data);

    //     if (hasPlaceholders(url)) {
    //         throw new Error('URL param has unresolved placeholders.');
    //     }

    //     let dataToSubmit = cloneDeep(data);

    //     if (props.before_submit) {
    //         dataToSubmit = await client.handleOperations(props.before_submit, context, dataToSubmit);
    //     }

    //     const response = await context.fetch(url, {
    //         method,
    //         body: JSON.stringify(dataToSubmit),
    //     });

    //     const result = await response.json();
    //     const { status } = response;

    //     if (failedValidationStatuses.includes(response.status)) {
    //         const incoming = props.errors?.path ? get(result, props.errors.path) : result;

    //         const { data } = await client.handleAdapter(props.errors?.adapter, incoming, context);

    //         errors = data;

    //         return Events.emit(failureEvent, { status, data: result, errors });
    //     }

    //     if (response.status >= 400) {
    //         return Events.emit(failureEvent, { status, data: result });
    //     }

    //     Events.emit(successEvent, result);
    // }

    // const components: Record<string, Any> = {
    //     default: Input,
    //     checkbox: Checkbox,
    // };
</script>

<form class={cn('flex flex-col gap-3', props.class)} enctype="multipart/form-data">
    <!-- {#each Object.entries(props.fields) as [field, input]} -->
    <!-- <svelte:component
            this={components[input.type ?? 'default'] ?? components['default']}
            bind:value={data[field]}
            errors={errors[field]}
            props={input}
        /> -->
    <!-- {/each} -->
    <Render props={content} />
    <pre>{JSON.stringify(form.data, null, 2)}</pre>
</form>
