<script lang="ts">
    import { Render } from '@/lib/core/index.js';
    const props = $props();

    let template = {
        row: {
            class: 'items-center gap-1 -mb-3',
            content: [
                { icon: { name: 'solar:check-circle-bold', class: 'text-positive mb-3' } },
                typeof props.content === 'string' ? { markdown: props.content } : props,
            ],
        },
    };
</script>

<Render props={template} />
