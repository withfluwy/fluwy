<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    const rowTheme = useTheme('layout.row');
</script>

<div class={cn('flex w-full gap-4', rowTheme, props.class)}>
    <Render {props} />
</div>
