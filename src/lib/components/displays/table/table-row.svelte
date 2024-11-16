<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import type { Column, Table } from './types.js';
    import { getColumnValue } from './utils.js';
    import ColumnComponent from './column.svelte';
    import { setupContext, createContext } from '@/lib/core/context/index.js';
    import { cn, cloneDeep } from '@/lib/core/utils/index.js';
    import { useClient } from '@/lib/core/index.js';
    import { useTheme } from '@/lib/core/client/index.js';

    interface TableRowProps {
        columns: Column[];
        record: Any;
        table: Table;
    }

    const { columns, record, table }: TableRowProps = $props();
    const context = createContext();
    const client = useClient();
    const defaultRowTheme = useTheme('tables.row.default');
    const clickableRowTheme = cn(
        'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50',
        useTheme('tables.row.clickable')
    );
    context.set('record', record);

    setupContext(context);

    const haveRowClick = $derived(Boolean(table.on_row_click));

    function getColumn(column: Column, record: Record<string, Any>): Column {
        return {
            ...column,
            record,
            value: getColumnValue(record, column),
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
        {
            [clickableRowTheme]: haveRowClick,
        },
        defaultRowTheme
    )}
>
    {#each columns as column}
        <ColumnComponent column={getColumn(column, record)} {table} />
    {/each}
</tr>
