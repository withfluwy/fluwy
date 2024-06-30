<script lang="ts">
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import dayjs from 'dayjs';
	import { TableSettings, formatDate } from '../utils';
	import type { Column, Table } from '../types';

	dayjs.extend(localizedFormat);

	export let column: Column;
	export let table: Table;

	$: formattedDatetime = formatDate(column.value, TableSettings.datetimeFormat);
</script>

<td class="whitespace-nowrap px-4 py-3.5">{formattedDatetime}</td>
