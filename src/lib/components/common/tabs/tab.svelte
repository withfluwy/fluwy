<script lang="ts">
    import type { Any, ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../styles.js';
    import { onMount } from 'svelte';
    import { userPrefersMode } from 'mode-watcher';
    import { browser } from '$app/environment';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { useTabs } from './composables.js';

    interface Props extends ElementProps {
        id: string;
        outer_radius?: boolean | 'off';
    }

    const props: Props = $props();
    const tabs = useTabs();
    const themeOuterRadius = useTheme('common.tab.outer_radius') ?? true;

    let outerRadius = $derived(props.outer_radius === false || props.outer_radius === 'off' ? false : themeOuterRadius);
    let tab: Any = $state(null);
    let cachedBgColor = 'rgb(255 255 255)';
    let style: CSSStyleDeclaration | undefined = $derived.by(() => {
        return browser && tab ? getComputedStyle(tab) : undefined;
    });
    let observer: MutationObserver | null = null;

    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const commonBackgroundColor = useCommon('background_color');
    const tabClassTheme = useTheme('common.tab.class');
    const tabTitleTheme = useTheme('common.tab.title');

    onMount(() => {
        if (!outerRadius) return;

        /**
         * This initialization is only used when the outer radius is enabled which is true by default.
         */
        initialize();

        observeDOMChanges(tab, () => {
            if (style!.backgroundColor === cachedBgColor) return;
            updateStyle(style!);
        });
    });

    $effect(() => {
        if (!browser) return;
        if (!outerRadius) return;
        if ($userPrefersMode) updateStyle(style!);
    });

    function updateStyle(style: CSSStyleDeclaration) {
        cachedBgColor = style.backgroundColor;
        tab.style.setProperty('--f-tab-bg', style.backgroundColor);
        tab.style.setProperty('--f-tab-border-color', style.borderColor);
    }

    function initialize() {
        const borderRadius = getComputedStyle(tab).borderBottomLeftRadius;

        /**
         * These variables are needed to change the style of the outer border of the tab according theme and styles
         * from the tailwind classes applied to the tab.
         */
        tab.style.setProperty('--f-tab-bg', cachedBgColor);
        tab.style.setProperty('--f-tab-border-color', getComputedStyle(tab).borderColor);
        tab.style.setProperty('--f-tab-border', getComputedStyle(tab).borderLeftWidth);

        /**
         * Fix the border radius of the tab on the bottom when initialized.
         * This is needed because of the outer border of the tab at the bottom of the tab.
         */
        tab.style.setProperty('--f-tab-radius', borderRadius);
        tab.style.setProperty('border-bottom-left-radius', '0');
        tab.style.setProperty('border-bottom-right-radius', '0');
    }

    function observeDOMChanges(node: Any, callback: globalThis.MutationCallback) {
        observer = new MutationObserver(callback);
        observer.observe(node, { childList: true, subtree: true, attributes: true });
    }

    function onclick() {
        tabs.setActiveTab(props.id);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onclick();
        }
    }
</script>

<div
    role="tab"
    tabindex="0"
    data-value={props.id}
    bind:this={tab as Any}
    {onclick}
    onkeydown={handleKeyDown}
    class={cn(
        commonBorderRadius,
        commonBorderColor,
        commonBackgroundColor,
        'relative z-10 -mb-px cursor-pointer border-x border-t px-4 py-1.5 text-sm [&:not([data-state=active])]:border-transparent [&:not([data-state=active])]:bg-transparent',
        tabClassTheme,
        tabTitleTheme,
        {
            'border-transparent bg-transparent': !tabs.isActive(props.id),
        },
        props.class
    )}
    data-state={tabs.isActive(props.id) ? 'active' : 'inactive'}
>
    <Render props={props.content} />
</div>

<style>
    :global(div[role='tablist'] > div[role='tab'][data-state='active']:not([disabled]):after) {
        z-index: 1;
        content: '';
        display: block;
        position: absolute;
        left: calc(var(--f-tab-radius, 0.5rem) * -1);
        width: calc(100% + var(--f-tab-radius, 0.5rem) * 2);
        height: var(--f-tab-radius, 0.5rem);
        bottom: 0;
        background-size: var(--f-tab-radius, 0.5rem);
        background-position:
            top left,
            top right;
        background-repeat: no-repeat;
        --tab-grad: calc(69% - var(--f-tab-border, 1px));
        --radius-start: radial-gradient(
            circle at top left,
            transparent var(--tab-grad),
            var(--f-tab-border-color) calc(var(--tab-grad) + 0.25px),
            var(--f-tab-border-color) calc(var(--tab-grad) + var(--f-tab-border, 1px)),
            var(--f-tab-bg) calc(var(--tab-grad) + var(--f-tab-border, 1px) + 0.25px)
        );
        --radius-end: radial-gradient(
            circle at top right,
            transparent var(--tab-grad),
            var(--f-tab-border-color) calc(var(--tab-grad) + 0.25px),
            var(--f-tab-border-color) calc(var(--tab-grad) + var(--f-tab-border, 1px)),
            var(--f-tab-bg) calc(var(--tab-grad) + var(--f-tab-border, 1px) + 0.25px)
        );

        background-image: var(--radius-start), var(--radius-end);
    }

    :global(div[role='tablist'] > div[role='tab'][data-state='active']:not([disabled]):first-child:after) {
        background-position: top right;
        background-image: var(--radius-end);
    }
</style>
