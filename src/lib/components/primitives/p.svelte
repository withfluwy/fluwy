<script lang="ts">
    import { useTheme } from '$lib/core/utils/index.js';
    import type { ElementProps } from '$lib/core/contracts.js';
    import { Render } from '$lib/core/index.js';
    import { cn } from '$lib/core/utils/index.js';
    import type { Snippet } from 'svelte';
    import { Typography } from './styles.js';

    interface H1Props extends ElementProps {
        children?: Snippet;
    }

    const { children, ...props }: H1Props = $props();
    const paragraphTheme = useTheme('typography.p');
</script>

<p class={cn(Typography.p, paragraphTheme, props.class)}>
    {#if props.content}
        {#if typeof props === 'string'}
            {props}
        {:else}
            <Render props={props.content} />
        {/if}
    {:else if children}
        {@render children()}
    {/if}
</p>
