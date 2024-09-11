<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import Sidebar from './sidebar.svelte';
    import Aside from './aside.svelte';

    interface BodyProps extends ElementProps {
        sidebar?: ElementProps;
        aside?: ElementProps;
    }

    const { sidebar, aside, ...props }: BodyProps = $props();
</script>

<div class={cn('relative flex w-full items-start', useTheme('layout.body'), props.class)}>
    {#if sidebar}
        <Sidebar {...sidebar} />
    {/if}

    <main id="main" class={cn('w-full', useTheme('layout.main'))}>
        <Render {props} />
    </main>

    {#if aside}
        <Aside {...aside} />
    {/if}
</div>
