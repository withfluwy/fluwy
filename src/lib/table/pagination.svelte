<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Button from '../button.svelte';
	import { Input } from '../form';
	import { Events } from '../core/utils/events';
	import type { Paginate, PaginationPayload, PaginationProps } from './types';
	import { browser } from '$app/environment';

	export let props: PaginationProps;

	let page: number = 1;
	let count = 0;
	let pageSize = 10;
	let recordsLength = 0;

	$: totalPages = Math.ceil(count / pageSize);
	$: hasPrevious = page > 1;
	$: hasNext = recordsLength > 0 ? recordsLength === pageSize && count > page * recordsLength : false;

	onMount(() => {
		if (browser) Events.on(Events.pagination(props.for), onPagination);
	});

	onDestroy(() => {
		if (browser) Events.removeListener(Events.pagination(props.for), onPagination);
	});

	function onPagination(pagination: PaginationPayload) {
		page = pagination.page;
		count = pagination.count;
		pageSize = pagination.pageSize;
		recordsLength = pagination.recordsLength;
	}

	function paginate(page: number): void {
		const paginateData: Paginate = {
			page,
			pageSize,
		};

		Events.emit(Events.paginate(props.for), paginateData);
	}

	function next() {
		paginate(page + 1);
	}

	function prev() {
		paginate(page - 1);
	}

	function onInputPageChange(event: Event) {
		const currentPage = page;
		let value = +(event.target as HTMLInputElement).value;

		if (isNaN(value)) {
			value = 1;
		}

		if (value > totalPages) {
			value = totalPages;
		}

		if (value < 1) {
			value = 1;
		}

		page = value;

		if (currentPage !== page) paginate(page);
	}
</script>

<div class="flex items-center justify-between py-4">
	<Button
		on:click={prev}
		props={{ content: 'Previous', icon_left: 'solar:arrow-left-linear', disabled: !hasPrevious }}
	/>

	<div class="flex items-center justify-between gap-1">
		Page
		<Input
			type="number"
			value={page}
			on:input={onInputPageChange}
			props={{ type: 'text', class: 'min-w-9 px-0 text-center', width_dynamic: true }}
		/>
		of {totalPages} - total of {count} records
	</div>

	<Button on:click={next} props={{ content: 'Next', icon_right: 'solar:arrow-right-linear', disabled: !hasNext }} />
</div>
