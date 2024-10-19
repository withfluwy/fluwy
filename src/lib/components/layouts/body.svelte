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

    const layoutBodyTheme = useTheme('layout.body');
    const layoutMainTheme = useTheme('layout.main');
</script>

<div class={cn('relative flex h-full items-stretch', layoutBodyTheme, props.class)}>
    {#if sidebar}
        <Sidebar {...sidebar} />
    {/if}

    <main class="relative flex w-full min-w-0 flex-col">
        {#if header}
            <Header {...header} id="main-header" />
        {/if}

        <div id="main" class={cn('w-full grow p-4', layoutMainTheme)}>
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
