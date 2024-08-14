<script lang="ts">
    import { useTheme } from '$lib/core/client/index.js';
    import type { ElementProps } from '$lib/core/contracts.js';
    import { Render } from '$lib/core/index.js';
    import { cn } from '$lib/core/utils/index.js';
    import type { Snippet } from 'svelte';
    import { Typography } from './styles.js';

    interface H1Props extends ElementProps {
        children?: Snippet;
    }

    const { children, ...props }: H1Props = $props();
    const theme = useTheme('typography.h6', Typography.h6);
</script>

<h6 class={cn(Typography.h6, theme, props.class)}>
    {#if props.content}
        {#if typeof props === 'string'}
            {props}
        {:else}
            <Render props={props.content} />
        {/if}
    {:else if children}
        {@render children()}
    {/if}
</h6>
