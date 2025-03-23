<script lang="ts">
    import { Render } from '@/lib/core/index.js';
    const props = $props();

    let template = {
        row: {
            class: 'items-center gap-1 -mb-3',
            content: [
                { icon: { name: 'solar:close-circle-bold', class: 'text-destructive mb-3' } },
                typeof props.content === 'string' ? { markdown: props.content } : props.content,
            ],
        },
    };
</script>

<Render props={template} />
