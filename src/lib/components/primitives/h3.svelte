<script lang="ts">
    import { useTheme } from '$lib/core/utils/index.js';
    import type { ElementProps } from '$lib/core/contracts.js';
    import { Render } from '$lib/core/index.js';
    import { cn, str } from '$lib/core/utils/index.js';
    import type { Snippet } from 'svelte';
    import { Typography } from './styles.js';

    interface H1Props extends ElementProps {
        children?: Snippet;
    }

    const { children, ...props }: H1Props = $props();
    const headingTheme = useTheme('typography.h3');
    const id = $derived.by(() => {
        if (typeof props.content !== 'string') return props.id;

        return props.id ?? str(props.content).slugCase();
    });
</script>

<h3 {id} class={cn(Typography.h3, headingTheme, props.class)}>
    {#if props.content}
        {#if typeof props === 'string'}
            {props}
        {:else}
            <Render props={props.content} />
        {/if}
    {:else if children}
        {@render children()}
    {/if}
</h3>
