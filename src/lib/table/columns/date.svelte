<script lang="ts">
    import localizedFormat from 'dayjs/plugin/localizedFormat.js';
    import dayjs from 'dayjs';
    import { TableSettings, formatDate } from '../utils.js';
    import { cn } from '$lib/core/utils/index.js';
    import type { Column, Table } from '../types.js';

    dayjs.extend(localizedFormat);

    interface DateProps {
        column: Column;
        table?: Table;
    }
    const { column }: DateProps = $props();

    let formattedDate = $derived(formatDate(column.value, TableSettings.dateFormat));
</script>

<td class={cn('whitespace-nowrap px-4 py-3.5', column?.class)}>{formattedDate}</td>
