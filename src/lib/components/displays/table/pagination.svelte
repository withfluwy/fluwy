<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import Button from '@/lib/components/forms/button/button.svelte';
    import { Events } from '@/lib/core/utils/events/index.js';
    import type { Paginate, PaginationPayload, PaginationProps } from './types.js';
    import { browser } from '$app/environment';
    import { useCommon } from '@/lib/components/common/styles.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { Input } from '@/lib/components/forms/index.js';
    import type { Any } from '@/lib/core/contracts.js';

    const props: PaginationProps = $props();

    const commonDebounce: number = useCommon('debounce');
    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.lg');
    const paginationTheme = useTheme('displays.table.pagination.wrapper');

    let page = $state(1);
    let total = $state(0);
    let pageSize = $state(10);
    let recordsLength = $state(0);
    let fetching = $state(false);

    const totalPages = $derived(Math.ceil(total / pageSize));
    const hasPrevious = $derived(page > 1);
    const hasNext = $derived(recordsLength > 0 ? recordsLength === pageSize && total > page * recordsLength : false);

    onMount(() => {
        if (browser) Events.on(Events.pagination(props.for), onPagination);
        if (browser) Events.on(Events.tableFetching(props.for), onTableFetching);
    });

    onDestroy(() => {
        if (browser) Events.removeListener(Events.pagination(props.for), onPagination);
        if (browser) Events.removeListener(Events.tableFetching(props.for), onTableFetching);
    });

    function onPagination(pagination: PaginationPayload) {
        page = pagination.page;
        total = pagination.total;
        pageSize = pagination.pageSize;
        recordsLength = pagination.recordsLength;
    }

    function onTableFetching(value: boolean) {
        fetching = value;
    }

    function paginate(page: number): void {
        const paginateData: Paginate = {
            page,
            pageSize,
        };

        Events.dispatchPaginate(props.for, paginateData);
    }

    function next() {
        paginate(page + 1);
    }

    function prev() {
        paginate(page - 1);
    }

    function debounce(fn: (...args: Any[]) => Any, delay: number) {
        let timeout: globalThis.NodeJS.Timeout;
        return (...args: Any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    function onInputPageChange(event: Event): void {
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

{#snippet pageInput()}
    <Input
        bind:value={page}
        oninput={debounce(onInputPageChange, commonDebounce)}
        disabled={fetching}
        type="text"
        width_dynamic
    />
{/snippet}

<div
    class={cn(
        commonBorderColor,
        commonBorderRadius,
        'flex items-center justify-between py-4',
        paginationTheme,
        props.class
    )}
>
    <Button
        onclick={prev}
        {...{ content: 'Previous', icon: 'solar:arrow-left-linear', disabled: !hasPrevious || fetching }}
    />

    <div class="flex items-center justify-between gap-1 text-sm">
        Page {@render pageInput()} of {totalPages}
        <span class="hidden sm:inline">- total of {total} records</span>
    </div>

    <Button onclick={next} {...{ content: 'Next', icon: 'solar:arrow-right-linear', disabled: !hasNext || fetching }} />
</div>
