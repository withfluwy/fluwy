<script lang="ts">
    import { Render } from '@/lib/core/index.js';
    const props = $props();

    let template = {
        row: {
            class: 'items-center gap-1',
            content: [
                { icon: { name: 'solar:close-circle-bold', class: 'text-destructive mb-3' } },
                { markdown: props.content },
            ],
        },
    };
</script>

<Render props={template} />
