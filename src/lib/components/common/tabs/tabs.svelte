<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { Any, ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn, str } from '@/lib/core/utils/index.js';
    import { Tabs } from 'bits-ui';
    import { Random } from '@/lib/core/utils/random/index.js';

    interface Props extends ElementProps {
        triggers: Any;
        content: TabObject[];
    }

    interface Tab {
        id?: string;
        class?: string;
        title: Any;
        panel: Any;
        outer_radius?: boolean | 'off';
    }

    interface TabObject {
        tab: Tab;
    }

    const { content, ...props }: Props = $props();
    const tabRootTheme = useTheme('common.tab.root');
    const tabListTheme = useTheme('common.tab.list');
    const tabs = $derived(content.map(buildTab));

    function buildTab({ tab }: TabObject): Tab {
        const id = getId(tab);
        const title = typeof tab.title === 'object' ? tab.title : { content: tab.title };
        const panel = typeof tab.panel === 'object' ? tab.panel : { content: tab.panel };

        return {
            id,
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

    const titles = $derived(tabs.map((tab) => tab.title));
    const panels = $derived(tabs.map((tab) => tab.panel));
</script>

<Tabs.Root class={cn('w-full min-w-0', tabRootTheme, props.class)}>
    <Tabs.List class={cn('relative', tabListTheme)}>
        {#each titles as title}
            <Render props={{ tab: title }} />
        {/each}
    </Tabs.List>

    {#each panels as panel}
        <Render props={{ tab_panel: panel }} />
    {/each}
</Tabs.Root>
