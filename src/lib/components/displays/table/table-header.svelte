<script lang="ts">
    import { Render } from '@/lib/core/index.js';
    import type { Column } from './types.js';

    interface TableHeaderProps {
        column: Column;
    }

    const { column }: TableHeaderProps = $props();
</script>

<th class="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-neutral-900">
    <Render props={column.header} />
</th>
