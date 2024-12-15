<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Tabs } from 'bits-ui';
    import { useCommon } from '../styles.js';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { onMount } from 'svelte';

    interface Props extends ElementProps {
        for: string;
        outer_radius?: boolean | 'off';
    }

    const { for: id, outer_radius = true, ...props }: Props = $props();

    const themeOuterRadius = useTheme('common.tab.outer_radius') ?? true;
    let outerRadius = $derived(outer_radius === false || outer_radius === 'off' ? false : themeOuterRadius);

    const commonBgColor = useCommon('background_color');
    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.lg');
    const tabClassTheme = useTheme('common.tab.class');
    const tabPanelTheme = useTheme('common.tab.panel');

    onMount(() => {
        const tabs = document.querySelectorAll(
            `button[role=tab][data-value="${id}"]`
        ) as globalThis.NodeListOf<HTMLElement>;

        tabs.forEach(removeTopLeftRadiusOfTab);
    });

    function removeTopLeftRadiusOfTab(tab: HTMLElement | null) {
        const parent = tab?.parentElement;

        // check if tab is first child of parent
        const isFirstChild = parent?.children[0] === tab;

        if (!isFirstChild) return;

        const panels = document.querySelectorAll(
            `[role="tabpanel"][aria-labelledby="${id}"]`
        ) as globalThis.NodeListOf<HTMLElement>;

        panels.forEach(removeTopLeftRadius);
    }

    function removeTopLeftRadius(element: HTMLElement | null) {
        if (!outerRadius) return;
        element?.style.setProperty('border-top-left-radius', '0');
    }
</script>

<Tabs.Content
    class={cn(
        commonBgColor,
        commonBorderRadius,
        commonBorderColor,
        'overflow-auto border p-4',
        tabClassTheme,
        tabPanelTheme,
        props.class
    )}
    value={id}
>
    <Render props={props.content} />
</Tabs.Content>
