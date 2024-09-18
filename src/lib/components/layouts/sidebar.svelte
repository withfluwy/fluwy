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

    let sidebar = $state<HTMLDivElement>();
    let sidebarIndicator = $state<HTMLDivElement>();
    let top = $state('0px');
    let height = $state('100vh');
    let mudationObserver: MutationObserver;
    let open = $state(false);
    let isMobile = $state(false);

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
    <!-- Mobile Sidebar -->
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
            useCommon('border_color'),
            'fixed inset-y-0 left-0 z-50 h-screen w-64 shrink-0 overflow-y-auto border-r bg-white p-3 transition-transform duration-300 ease-in-out dark:bg-neutral-900',
            open ? 'translate-x-0' : '-translate-x-full',
            useTheme('layout.sidebar'),
            props.class
        )}
    >
        <Button
            icon_left={{
                name: 'ph:x-bold',
                size: 16,
            }}
            class="absolute right-4 !size-6 p-0 text-gray-500 hover:text-gray-700"
            variant="ghost"
            color="gray"
            onclick={toggleSidebar}
        ></Button>
        <div
            id="sidebar-indicator"
            bind:this={sidebarIndicator}
            class={cn('invisible absolute flex items-center transition-all duration-200')}
        >
            <div class={cn('h-full w-1 rounded-full bg-primary', useTheme('layout.sidebar_indicator'))}></div>
        </div>
        <Render {props} />
    </div>
{:else}
    <!-- Desktop Sidebar -->
    <div
        id="sidebar"
        bind:this={sidebar}
        style:top
        style:height
        class={cn(
            useCommon('border_color'),
            'sticky inset-y-0 z-10 h-screen w-64 shrink-0 overflow-y-auto border-r bg-white p-3 dark:bg-neutral-900',
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
{/if}
