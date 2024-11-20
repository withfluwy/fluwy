<script lang="ts">
    import { Render } from '@/lib/core/index.js';
    import type { Column } from './types.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../../common/styles.js';

    interface TableHeaderProps {
        column: Column;
    }

    const { column }: TableHeaderProps = $props();
    const tableHeaderTheme = useTheme('displays.table.header');
    const commonBorderColor = useCommon('border_color');
</script>

<th
    class={cn(
        commonBorderColor,
        'whitespace-nowrap border-b bg-neutral-50 px-4 py-2 text-left text-sm font-semibold text-neutral-900 dark:bg-neutral-900 dark:text-white/80',
        tableHeaderTheme,
        column.header?.class
    )}
>
    <Render props={column.header} />
</th>
