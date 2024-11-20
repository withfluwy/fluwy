<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import type { Column, Table } from './types.js';
    import TableCell from './table-cell.svelte';
    import { setupContext, createContext } from '@/lib/core/context/index.js';
    import { cn, cloneDeep } from '@/lib/core/utils/index.js';
    import { useClient } from '@/lib/core/index.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { useCommon } from '@/lib/components/common/styles.js';

    interface TableRowProps {
        columns: Column[];
        record: Any;
        table: Table;
    }

    const { columns, record, table }: TableRowProps = $props();
    const context = createContext();
    const client = useClient();
    const commonBorderColor = useCommon('border_color');
    const defaultRowTheme = useTheme('displays.table.row.default');
    const clickableRowTheme = cn(
        'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50',
        useTheme('displays.table.row.clickable')
    );
    context.set('record', record);

    setupContext(context);

    const haveRowClick = $derived(Boolean(table.on_row_click));

    function getColumn(column: Column, record: Record<string, Any>): Column {
        return {
            ...column,
            record,
        };
    }

    async function onclick() {
        if (!haveRowClick) return;

        return client.handleOperations(table.on_row_click, context, cloneDeep(record));
    }
</script>

<tr
    {onclick}
    class={cn(
        commonBorderColor,
        {
            [clickableRowTheme]: haveRowClick,
        },
        defaultRowTheme
    )}
>
    {#each columns as column}
        <TableCell column={getColumn(column, record)} {table} />
    {/each}
</tr>
