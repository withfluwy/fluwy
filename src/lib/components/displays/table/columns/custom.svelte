<script lang="ts">
    import type { Column, Table } from '../types.js';

    import { cn } from '@/lib/core/utils/index.js';
    import { Render } from '@/lib/core/index.js';

    interface CustomProps {
        column: Column;
        table?: Table;
    }

    const { column }: CustomProps = $props();
</script>

<td class={cn('flex gap-0.5 whitespace-nowrap px-4 py-3.5', column?.class)}>
    <Render props={column.content} />
</td>
