<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    const { id = 'header', ...props }: ElementProps = $props();
    const layoutHeaderTheme = useTheme('layout.header');
    const commonBorderColor = useCommon('border_color');
    const commonBackgroundColor = useCommon('background_color');
</script>

<div
    {id}
    class={cn(
        commonBorderColor,
        commonBackgroundColor,
        'sticky top-0 z-[2] flex min-h-14 items-center gap-3 border-b bg-gray-50/90 px-4 py-3 backdrop-blur dark:bg-neutral-800/80',
        layoutHeaderTheme,
        props.class
    )}
>
    <Render {props} />
</div>
