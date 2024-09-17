<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';
    import { onDestroy, onMount } from 'svelte';

    const props: ElementProps = $props();

    let sidebar: HTMLDivElement;
    let sidebarIndicator: HTMLDivElement;
    let top = $state('0px');
    let height = $state('100vh');
    let mudationObserver: MutationObserver;

    const allDomMutations: MutationObserverInit = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
        characterData: true,
    };

    $effect(() => {
        if (!sidebar) return;

        top = sidebar.getBoundingClientRect().top + 'px';
        height = `calc(100vh - ${top})`;
    });

    onMount(() => {
        mudationObserver = new MutationObserver(onMutation);
        mudationObserver.observe(sidebar, allDomMutations);
    });

    onDestroy(() => {
        mudationObserver?.disconnect();
    });

    function onMutation() {
        const activeItem = sidebar.querySelector('.active');

        if (!activeItem) return;

        const indicatorTop = activeItem.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
        const indicatorHeight = activeItem.getBoundingClientRect().height;

        const groupMenu = activeItem.parentElement;
        const indicatorLeft = groupMenu!.getBoundingClientRect().left - sidebar.getBoundingClientRect().left;

        sidebarIndicator.style.top = `${indicatorTop}px`;
        sidebarIndicator.style.height = `${indicatorHeight}px`;
        sidebarIndicator.style.left = `${indicatorLeft}px`;
    }
</script>

<div
    id="sidebar"
    bind:this={sidebar}
    style:top
    style:height
    class={cn(
        useCommon('border_color'),
        'sticky z-[1] h-screen w-64 shrink-0 overflow-y-auto border-r p-3',
        useTheme('layout.sidebar'),
        props.class
    )}
>
    <div
        id="sidebar-indicator"
        bind:this={sidebarIndicator}
        class={cn('invisible absolute flex items-center transition-all duration-200')}
    >
        <div class={cn('h-full w-1 rounded-full bg-primary', useTheme('layout.sidebar_indicator'))}></div>
    </div>

    <Render {props} />
</div>
