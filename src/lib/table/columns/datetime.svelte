<script lang="ts">
    import localizedFormat from 'dayjs/plugin/localizedFormat.js';
    import dayjs from 'dayjs';
    import { TableSettings, formatDate } from '../utils.js';
    import type { Column, Table } from '../types.js';

    dayjs.extend(localizedFormat);

    interface DatetimeProps {
        column: Column;
        table?: Table;
    }

    const { column }: DatetimeProps = $props();

    let formattedDatetime = $derived(formatDate(column.value, TableSettings.datetimeFormat));
</script>

<td class="whitespace-nowrap px-4 py-3.5">{formattedDatetime}</td>
