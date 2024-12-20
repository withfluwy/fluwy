<script lang="ts">
    import { cn } from '@/lib/core/utils/index.js';
    import type { FormProps, FormState } from './types.js';
    import { Render, app, createContext } from '@/lib/core/index.js';
    import { collapseObject } from '@/lib/core/utils/normalize-object/index.js';
    import { setupContext } from '@/lib/core/context/index.js';

    const { id, content, ...props }: FormProps = $props();

    const context = createContext();

    /**
     * Forms should create its own context for its data and validation errors. This context will be accessible to all
     * child components.
     */
    setupContext(context);

    const form: FormState = $state({
        data: collapseObject(props.data ?? {}),
        errors: {},
        submitting: false,
        pristine: true,
        get dirty() {
            return !this.pristine;
        },
    });

    const method = $derived((props.method || 'POST') as 'POST' | 'GET' | 'DIALOG');

    context.set('form', form);

    async function onsubmit(event: SubmitEvent) {
        if (!props.on_submit) return;
        event.preventDefault();

        try {
            form.submitting = true;
            await app.handleOperations(props.on_submit, context);
        } finally {
            form.submitting = false;
        }
    }
</script>

<form {id} {onsubmit} {method} class={cn('flex flex-col gap-4', props.class)} enctype="multipart/form-data">
    <Render props={content} />
</form>
