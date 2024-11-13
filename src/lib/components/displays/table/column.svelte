<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import * as columnComponents from './columns/index.js';
    import type { Column, Table } from './types.js';

    interface Props {
        column: Column;
        table: Table;
    }

    const { column, table }: Props = $props();

    function getColumnComponent(column: Column): Any {
        return columnComponents[column.type ?? 'text'];
    }

    const DynamicColumnComponent: Any = getColumnComponent(column);
</script>

<DynamicColumnComponent {column} {table} class={column.class} />
