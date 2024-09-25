<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import Sidebar from './sidebar.svelte';
    import Aside from './aside.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';

    interface BodyProps extends ElementProps {
        header?: ElementProps;
        footer?: ElementProps;
        sidebar?: ElementProps;
        aside?: ElementProps;
    }

    const { sidebar, aside, header, footer, ...props }: BodyProps = $props();
</script>

<div class={cn('relative flex h-full items-stretch', useTheme('layout.body'), props.class)}>
    {#if sidebar}
        <Sidebar {...sidebar} />
    {/if}

    <main class="relative flex w-full flex-col">
        {#if header}
            <Header {...header} id="main-header" />
        {/if}

        <div id="main" class={cn('w-full grow sm:p-10 dark:bg-neutral-800', useTheme('layout.main'))}>
            <Render {props} />
        </div>

        {#if footer}
            <Footer {...footer} />
        {/if}
    </main>

    {#if aside}
        <Aside {...aside} />
    {/if}
</div>
