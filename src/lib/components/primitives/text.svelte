<script lang="ts">
    import { compile, Render, useContext, type ElementProps } from '@/lib/core/index.js';

    const props: ElementProps = $props();
    const context = useContext();

    const classes = $derived((props as ElementProps)?.class || '');
</script>

<span class={classes}>
    {#if props.content}
        {#if typeof props.content === 'string'}
            {compile(props.content, context.data)}
        {:else}
            <Render props={props.content} />
        {/if}
    {/if}
</span>
