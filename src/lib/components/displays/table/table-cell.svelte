<script lang="ts">
    import type { Column, Table } from './types.js';
    import { cn, cloneDeep } from '@/lib/core/utils/index.js';
    import { app, Render, useContext } from '@/lib/index.js';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { useCommon } from '../../common/styles.js';
    import type { Any } from '@/lib/core/contracts.js';

    interface Props {
        column: Column;
        table: Table;
        record: Record<string, Any>;
        class?: string;
    }

    const context = useContext();

    const { column, record, ...props }: Props = $props();

    const cellTheme = useTheme('displays.table.cell.default');
    const cellClickableTheme = cn(
        'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200',
        useTheme('displays.table.cell.clickable')
    );
    const commonBorderColor = useCommon('border_color');

    const isClickable = $derived(Boolean(column.on_click));

    async function onclick(event: MouseEvent) {
        if (!isClickable) return;

        event.stopPropagation();

        await app.handleOperations(column.on_click, context, cloneDeep(record));
    }
</script>

<td
    {onclick}
    class={cn(commonBorderColor, 'table-cell whitespace-nowrap px-4 py-2.5', cellTheme, props.class, column?.class, {
        [cellClickableTheme]: isClickable,
    })}
>
    <Render props={column.content} />
</td>
