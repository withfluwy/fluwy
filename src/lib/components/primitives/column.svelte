<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    const columnTheme = useTheme('layout.column');
</script>

<div class={cn('flex flex-col items-start gap-4', columnTheme, props.class)}>
    <Render {props} />
</div>
