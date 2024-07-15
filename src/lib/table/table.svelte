<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import * as columnComponents from './columns/index.js';
    import type { Column, Paginate, PaginationPayload, Table } from './types.js';
    import { getColumnValue } from './utils.js';
    import { get } from '../core/utils/index.js';
    import { goto } from '$app/navigation';
    import type { Any } from '../core/contracts.js';
    import { Events } from '../core/utils/events/index.js';
    import { browser } from '$app/environment';
    import { useContext, compile } from '../core/index.js';

    export let props: Table;

    const context = useContext();

    let records: any[] = [];
    let count = 0;
    let credentials = props.credentials || 'omit';

    $: params = props.pagination?.params ?? { page: 'page', page_size: 'page_size' };
    $: resultsPath = props.pagination?.paths?.results || 'results';
    $: countPath = props.pagination?.paths?.count || 'count';

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
        const query = new URLSearchParams();
        query.append(params.page ?? 'page', page.toString());
        query.append(params.page_size ?? 'page_size', pageSize.toString());

        const response = await context.fetch(`${props.url}?${query}`, {
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

    function getColumn(column: Column, record: Record<string, Any>): Column {
        return {
            ...column,
            record,
            value: getColumnValue(record, column),
        };
    }
</script>

<div class="overflow-x-auto rounded-xl border shadow-sm">
    <table class="w-full">
        <thead class="border-b bg-gray-50">
            <tr>
                {#each props.columns as column}
                    <th class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {column.header ?? ''}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each records as record}
                <tr on:click={() => onRowClick(record)} class="cursor-pointer hover:bg-gray-50/80">
                    {#each props.columns as column}
                        <svelte:component
                            this={columnComponents[column.type ?? 'text']}
                            column={getColumn(column, record)}
                            table={props}
                        />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
