<script lang="ts">
    import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';

    const props: ElementProps | any[] = $props();

    const classes = $derived(withClasses(props, 'flex flex-col items-start'));
</script>

<div class={classes}>
    <Render {props} />
</div>
