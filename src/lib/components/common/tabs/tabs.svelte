<script lang="ts">
    import type { Any, ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Tabs } from 'bits-ui';

    interface Props extends ElementProps {
        triggers: Any;
    }

    const { triggers, content, ...props }: Props = $props();
</script>

<Tabs.Root class={cn('w-full [&>[role="tabpanel"]:nth-of-type(2)]:rounded-tl-none', props.class)}>
    <Tabs.List class="relative">
        {#if triggers}
            <Render props={triggers} />
        {/if}
    </Tabs.List>

    <Render props={content} />
</Tabs.Root>
