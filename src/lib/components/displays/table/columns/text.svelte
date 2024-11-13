<script lang="ts">
    import { cn, isNil } from '$lib/core/utils/index.js';
    import type { Column, Table } from '../types.js';

    interface TextProps {
        column: Column;
        table?: Table;
    }

    const { column }: TextProps = $props();
</script>

<td class={cn('whitespace-nowrap px-4 py-3.5', column?.class)}>
    {#if !isNil(column.value)}
        {column.value}
    {:else}
        <span class="opacity-50">-</span>
    {/if}
</td>
