<script lang="ts">
	import type { Column, Table } from '../types';

	import { cn } from '../../core/utils';
	import { Render } from '../../core';
	import { createContext } from '../../core/context';
	import { setContext } from 'svelte';

	export let column: Column;
	export let table: Table;

	const context = createContext();
	setContext('context', context);

	$: context.set('record', column.record);
</script>

<td class={cn('flex gap-0.5 whitespace-nowrap px-4 py-3.5', column?.class)}>
	<Render props={column.content} />
</td>
