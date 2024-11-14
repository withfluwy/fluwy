<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import type { Column, Table } from './types.js';
    import { getColumnValue } from './utils.js';
    import ColumnComponent from './column.svelte';
    import { createContext } from '$lib/core/context.svelte.js';
    import { setupContext } from '@/lib/core/context/index.js';

    interface TableRowProps {
        onclick: () => unknown;
        columns: Column[];
        record: Any;
        table: Table;
    }

    const { onclick, columns, record, table }: TableRowProps = $props();

    function getColumn(column: Column, record: Record<string, Any>): Column {
        return {
            ...column,
            record,
            value: getColumnValue(record, column),
        };
    }
    const context = createContext();
    context.set('record', record);

    setupContext(context);
</script>

<tr {onclick} class="cursor-pointer hover:bg-neutral-50/80">
    {#each columns as column}
        <ColumnComponent column={getColumn(column, record)} {table} />
    {/each}
</tr>
