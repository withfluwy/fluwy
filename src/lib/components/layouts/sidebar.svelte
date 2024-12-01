<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';
    import { onDestroy, onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { fade } from 'svelte/transition';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { afterNavigate } from '$app/navigation';
    import { Button } from '../forms/index.js';

    const props: ElementProps = $props();

    const commonBorderColor = useCommon('border_color');
    const commonBackgroundColor = useCommon('background_color');
    const layoutSidebarTheme = useTheme('layout.sidebar');
    const layoutSidebarIndicatorTheme = useTheme('layout.sidebar_indicator');
    let sidebar = $state<HTMLDivElement>();
    let sidebarIndicator = $state<HTMLDivElement>();
    let top = $state('0px');
    let height = $state('100vh');
    let mudationObserver: MutationObserver;
    let open = $state(false);
    let isMobile = $state(false);

    const allDomMutations: globalThis.MutationObserverInit = {
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

    function checkMobile() {
        if (browser) {
            isMobile = window.matchMedia('(max-width: 1023px)').matches;
        }
    }

    onMount(() => {
        checkMobile();
        if (browser) {
            window.addEventListener('resize', checkMobile);
            Events.on('ToggleSidebar', toggleSidebar);
        }
        mudationObserver = new MutationObserver(onMutation);
        mudationObserver.observe(sidebar!, allDomMutations);
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('resize', checkMobile);
            Events.removeListener('ToggleSidebar', toggleSidebar);
        }
        mudationObserver?.disconnect();
    });

    function onMutation() {
        const activeItem = sidebar!.querySelector('.active');

        if (!activeItem) return;

        const indicatorTop = activeItem.getBoundingClientRect().top - sidebar!.getBoundingClientRect().top;
        const indicatorHeight = activeItem.getBoundingClientRect().height;

        const groupMenu = activeItem.parentElement;
        const indicatorLeft = groupMenu!.getBoundingClientRect().left - sidebar!.getBoundingClientRect().left;

        sidebarIndicator!.style.top = `${indicatorTop}px`;
        sidebarIndicator!.style.height = `${indicatorHeight}px`;
        sidebarIndicator!.style.left = `${indicatorLeft}px`;
    }

    function toggleSidebar() {
        open = !open;
    }

    afterNavigate(() => {
        if (isMobile && open) {
            toggleSidebar();
        }
    });
</script>

{#if isMobile}
    {#if open}
        <div
            role="button"
            tabindex="0"
            class="fixed inset-0 z-40 bg-black/50 backdrop-blur"
            onclick={toggleSidebar}
            onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}
            transition:fade={{ duration: 300 }}
        ></div>
    {/if}
    <div
        id="sidebar"
        bind:this={sidebar}
        class={cn(
            commonBorderColor,
            commonBackgroundColor,
            'fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r p-3 transition-transform duration-300 ease-in-out lg:hidden',
            open ? 'translate-x-0' : '-translate-x-full',
            layoutSidebarTheme,
            props.class
        )}
    >
        <Button
            icon={{
                name: 'ph:x-bold',
                size: 16,
            }}
            class="absolute right-3 top-3 z-40 !size-6 p-0"
            variant="ghost"
            onclick={toggleSidebar}
        ></Button>
        <div
            id="sidebar-indicator"
            bind:this={sidebarIndicator}
            class={cn('invisible absolute flex items-center transition-all duration-200')}
        >
            <div class={cn('h-full w-1 rounded-full bg-primary', layoutSidebarIndicatorTheme)}></div>
        </div>
        <Render {props} />
    </div>
{:else}
    <div
        id="sidebar"
        bind:this={sidebar}
        style:top
        style:height
        class={cn(
            commonBorderColor,
            commonBackgroundColor,
            'sticky inset-y-0 z-[1] hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r p-3 lg:flex',
            layoutSidebarTheme,
            props.class
        )}
    >
        <div
            id="sidebar-indicator"
            bind:this={sidebarIndicator}
            class={cn('invisible absolute flex items-center transition-all duration-200')}
        >
            <div class={cn('h-full w-1 rounded-full bg-primary', layoutSidebarIndicatorTheme)}></div>
        </div>
        <Render {props} />
    </div>
{/if}
