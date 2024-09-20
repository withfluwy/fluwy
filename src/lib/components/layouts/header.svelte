<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    interface HeaderProps extends ElementProps {
        id?: string;
    }

    const { id = 'header', ...props }: HeaderProps = $props();
</script>

<div
    {id}
    class={cn(
        useCommon('border_color'),
        useCommon('background_color'),
        'sticky top-0 z-[2] flex items-center gap-3 border-b bg-gray-50/90 px-4 py-3 backdrop-blur dark:bg-neutral-800/80',
        useTheme('layout.header'),
        props.class
    )}
>
    <Render {props} />
</div>
