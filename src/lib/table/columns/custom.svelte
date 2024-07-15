<script lang="ts">
    import type { Column, Table } from '../types.js';

    import { cn } from '../../core/utils/index.js';
    import { Render } from '../../core/index.js';
    import { createContext } from '../../core/context/index.js';
    import { setContext } from 'svelte';

    interface CustomProps {
        column: Column;
        table?: Table;
    }

    const { column }: CustomProps = $props();

    const context = createContext();
    setContext('context', context);

    $effect(() => {
        context.set('record', column.record);
    });
</script>

<td class={cn('flex gap-0.5 whitespace-nowrap px-4 py-3.5', column?.class)}>
    <Render props={column.content} />
</td>
