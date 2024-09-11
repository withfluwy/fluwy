<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    interface BannerProps extends ElementProps {}

    const props: BannerProps = $props();
</script>

<div
    id="header"
    class={cn(
        'sticky top-0 z-[2] flex items-center gap-3 border-b bg-gray-100/50 p-3 dark:bg-gray-800/80',
        useCommon('border_color'),
        useCommon('foreground_color'),
        useTheme('layout.header'),
        props.class
    )}
>
    <Render {props} />
</div>
