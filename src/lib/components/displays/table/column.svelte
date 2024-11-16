<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import * as columnComponents from './columns/index.js';
    import type { Column, Table } from './types.js';
    import { cn } from '@/lib/core/utils/index.js';

    interface Props {
        column: Column;
        table: Table;
    }

    const { column, table }: Props = $props();

    function getColumnComponent(column: Column): Any {
        if (column.content) return columnComponents.custom;
        return columnComponents[column.type ?? 'text'];
    }

    const DynamicColumnComponent: Any = getColumnComponent(column);
</script>

<DynamicColumnComponent {column} {table} class={cn('table-cell', column.class)} />
