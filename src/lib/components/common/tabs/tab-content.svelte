<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Tabs } from 'bits-ui';
    import { useCommon } from '../styles.js';

    interface Props extends ElementProps {
        for: string;
    }

    const { for: id, ...props }: Props = $props();
    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.lg');
</script>

<Tabs.Content class={cn(commonBorderRadius, commonBorderColor, 'border p-4', props.class)} value={id}>
    <Render props={props.content} />
</Tabs.Content>
