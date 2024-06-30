<script lang="ts">
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import dayjs from 'dayjs';
	import { TableSettings, formatDate } from '../utils';
	import { cn } from '$lib/utils';
	import type { Column, Table } from '../types';

	dayjs.extend(localizedFormat);

	export let column: Column;
	export let table: Table;

	$: formattedDate = formatDate(column.value, TableSettings.dateFormat);
</script>

<td class={cn('whitespace-nowrap px-4 py-3.5', column?.class)}>{formattedDate}</td>
