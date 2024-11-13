<script lang="ts">
    import { Render, type ElementProps } from '@/lib/core/index.js';

    const props: ElementProps | string = $props();

    const classes = $derived((props as ElementProps)?.class || '');
</script>

<span class={classes}><Render {props} /></span>
