<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Paginate, PaginationPayload, Table } from './types.js';
    import { cn, delay, get } from '@/lib/core/utils/index.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { browser } from '$app/environment';
    import { useContext } from '@/lib/core/index.js';
    import TableRow from './table-row.svelte';
    import TableHeader from './table-header.svelte';
    import { useTheme } from '@/lib/core/client/index.js';
    import { useCommon } from '@/lib/components/common/styles.js';
    import { Icon } from '@/lib/components/common/index.js';
    import { blur } from 'svelte/transition';

    const props: Table = $props();

    const context = useContext();

    let records = $state<Any[]>([]);
    let count = $state(0);
    let loading = $state(false);
    let fetching = $state(false);
    const credentials = $derived(props.credentials || 'omit');

    const params = $derived(props.pagination?.params ?? { page: 'page', page_size: 'page_size' });
    const resultsPath = $derived(props.pagination?.paths?.results || 'results');
    const countPath = $derived(props.pagination?.paths?.count || 'count');
    const tableWrapperTheme = useTheme('displays.table.wrapper');
    const commonBorderColor = useCommon('border_color');
    const spinner = useCommon('spinner');
    const commonDelay = useCommon('delay');

    onMount(async () => {
        if (props.id && browser) {
            Events.on(Events.refresh(props.id), onRefresh);
            Events.on(Events.paginate(props.id), fetchData);
        }

        await fetchData();
    });

    onDestroy(() => {
        if (props.id && browser) Events.removeListener(Events.refresh(props.id), onRefresh);
    });

    function onRefresh() {
        fetchData();
    }

    async function fetchData({ page, pageSize }: Paginate = { page: 1, pageSize: 10 }) {
        const url = new URL(props.url);
        const alreadyHasPageSize = url.searchParams.has(params.page_size ?? 'page_size');
        const alreadyHasPage = url.searchParams.has(params.page ?? 'page');
        fetching = true;

        delay(() => (loading = true), {
            after: commonDelay,
            if: () => fetching,
        });
        // TODO: dispatch event to notify that the table is loading. So pagination
        // component can change to loading state

        pageSize = alreadyHasPageSize
            ? parseInt(url.searchParams.get(params.page_size ?? 'page_size') as string)
            : pageSize;
        page = alreadyHasPage ? parseInt(url.searchParams.get(params.page ?? 'page') as string) : page;

        if (!alreadyHasPage) url.searchParams.append(params.page ?? 'page', page.toString());
        if (!alreadyHasPageSize) url.searchParams.append(params.page_size ?? 'page_size', pageSize.toString());

        const response = await context.fetch(url, {
            credentials,
        });

        const responseBody = await response.json();

        if (resultsPath === 'root') {
            records = responseBody;
            return;
        }

        records = get(responseBody, resultsPath, []);
        count = get(responseBody, countPath, 0);
        fetching = false;
        loading = false;
        Events.emit(Events.pagination(props.id), {
            page,
            count,
            pageSize,
            recordsLength: records.length,
        } as PaginationPayload);
    }
</script>

<div
    class={cn(
        commonBorderColor,
        'relative overflow-hidden rounded-xl border bg-white dark:bg-neutral-800',
        { 'min-h-40': loading },
        tableWrapperTheme
    )}
>
    {#if loading}
        <div
            transition:blur
            class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur dark:bg-neutral-800/50"
        >
            <Icon name={spinner} />
        </div>
    {/if}

    <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr>
                    {#each props.columns as column}
                        <TableHeader {column} />
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each records as record (record.id)}
                    <TableRow columns={props.columns} table={props} {record} />
                {/each}
            </tbody>
        </table>
    </div>
</div>
