<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import type { Any, ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Random } from '@/lib/core/utils/random/index.js';
    import { type Tab, type TabsContract } from './types.js';
    import { setTabs } from './composables.js';
    import { onMount } from 'svelte';

    interface Props extends ElementProps {
        triggers: Any;
        content: TabObject[];
    }

    interface TabObject {
        tab: Tab;
    }

    const { content, ...props }: Props = $props();
    const tabRootTheme = useTheme('common.tab.root');
    const tabListTheme = useTheme('common.tab.list');
    const tabsList = $derived(content.map(buildTab));

    function buildTab({ tab }: TabObject): Tab {
        const id = getId(tab);
        const title = Array.isArray(tab.title) || typeof tab.title !== 'object' ? { content: tab.title } : tab.title;
        const panel = Array.isArray(tab.panel) || typeof tab.panel !== 'object' ? { content: tab.panel } : tab.panel;

        return {
            id,
            active_by_default: tab.active_by_default ?? false,
            title: {
                ...title,
                id,
                class: cn(tab.class, tab.title.class),
                outer_radius: tab.outer_radius,
                content: tab.title.content ?? tab.title,
            },
            panel: {
                ...panel,
                for: id,
                class: cn(tab.class, tab.panel.class),
                outer_radius: tab.outer_radius,
                content: tab.panel.content ?? tab.panel,
            },
        };
    }

    function getId(tab: Tab): string {
        if (tab.id) return tab.id;

        return Random.id();
    }

    const titles = $derived(tabsList.map((tab) => tab.title));
    const panels = $derived(tabsList.map((tab) => tab.panel));

    const tabs: TabsContract = $state<TabsContract>({
        isActive(id) {
            return id === this.activeTab?.id;
        },
        setActiveTab(id) {
            this.activeTab = titles.find((tab) => tab.id === id);
        },
    });

    onMount(() => {
        tabs.setActiveTab(tabsList.find((tab) => tab.active_by_default)?.id ?? tabsList[0]?.id ?? '');
    });

    setTabs(tabs);
</script>

<div class={cn('relative w-full min-w-0 flex-col', tabRootTheme, props.class)}>
    <div role="tablist" class={cn('relative flex items-center', tabListTheme)}>
        {#each titles as title}
            <Render props={{ tab: title }} />
        {/each}
    </div>

    {#each panels as panel}
        {#if tabs.isActive(panel.for)}
            <Render props={{ tab_panel: panel }} />
        {/if}
    {/each}
</div>
