<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    let sidebar: HTMLDivElement;
    let top = $state('0px');
    let height = $state('100vh');

    $effect(() => {
        if (!sidebar) return;

        top = sidebar.getBoundingClientRect().top + 'px';
        height = `calc(100vh - ${top})`;
    });
</script>

<div
    id="sidebar"
    bind:this={sidebar}
    style:top
    style:height
    class={cn(
        'sticky z-[1] h-screen w-64 shrink-0 overflow-y-auto border border-green-500 bg-green-100 p-3',
        useTheme('layout.sidebar'),
        props.class
    )}
>
    sidebar
</div>
