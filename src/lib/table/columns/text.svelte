<script lang="ts">
	import { cn } from '$lib/utils';
	import { isNil } from '../../core/utils';
	import type { Column, Table } from '../types';

	export let column: Column;
	export let table: Table;
</script>

<td class={cn('whitespace-nowrap px-4 py-3.5', column?.class)}>
	{#if !isNil(column.value)}
		{column.value}
	{:else}
		<span class="opacity-50">-</span>
	{/if}
</td>
