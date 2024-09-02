<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';

    const props: ElementProps | Any[] = $props();

    const classes = $derived(withClasses(props, 'flex flex-col items-start'));
</script>

<div class={classes}>
    <Render {props} />
</div>
