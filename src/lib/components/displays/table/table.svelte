<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Paginate, PaginationPayload, Table } from './types.js';
    import { get } from '@/lib/core/utils/index.js';
    import { goto } from '$app/navigation';
    import type { Any } from '@/lib/core/contracts.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { browser } from '$app/environment';
    import { useContext, compile } from '@/lib/core/index.js';
    import TableRow from './table-row.svelte';
    import TableHeader from './table-header.svelte';

    const props: Table = $props();

    const context = useContext();

    let records = $state<Any[]>([]);
    let count = $state(0);
    const credentials = $derived(props.credentials || 'omit');

    const params = $derived(props.pagination?.params ?? { page: 'page', page_size: 'page_size' });
    const resultsPath = $derived(props.pagination?.paths?.results || 'results');
    const countPath = $derived(props.pagination?.paths?.count || 'count');

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

        Events.emit(Events.pagination(props.id), {
            page,
            count,
            pageSize,
            recordsLength: records.length,
        } as PaginationPayload);
    }

    function onRowClick(record: Record<string, unknown>) {
        if (!props.on_row_click) return;
        if (!props.on_row_click.goto) throw 'on_row_click.goto is required';

        const uri = compile(props.on_row_click.goto, { record });

        if (uri.startsWith('http')) return (window.location.href = uri);

        goto(uri);
    }
</script>

<div class="overflow-hidden rounded-xl border">
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead class="border-b bg-neutral-50">
                <tr>
                    {#each props.columns as column}
                        <!-- <th class="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-neutral-900">
                            {column.header ?? ''}
                        </th> -->
                        <TableHeader {column} />
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each records as record}
                    <TableRow columns={props.columns} table={props} {record} onclick={() => onRowClick(record)} />
                {/each}
            </tbody>
        </table>
    </div>
</div>
