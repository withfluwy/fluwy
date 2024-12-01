<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Paginate, Table } from './types.js';
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
    const defaultPerPage = Number(useTheme('displays.table.page_size') ?? 10);

    let records = $state<Any[]>(props.data ?? []);
    let total = $state(0);
    let loading = $state(false);
    let fetching = $state(false);
    let pageSize = $state(props.page_size ?? defaultPerPage);

    const trackBy = $derived(props.track_by ?? 'id');
    const credentials = $derived(props.credentials || 'omit');
    const params = $derived(props.params ?? {});
    const paths = $derived(props.paths ?? {});
    const defaultSort = $derived(props.sort?.default ?? '-id');
    const tableWrapperTheme = useTheme('displays.table.wrapper');
    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.lg');
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

    async function fetchData({ page = 1, pageSize: newPageSize = pageSize }: Partial<Paginate> = {}) {
        if (!props.url) return;

        const url = new URL(props.url);
        const hasPageSizeOnUrl = url.searchParams.has(params.page_size ?? 'page_size');
        const alreadyHasPage = url.searchParams.has(params.page ?? 'page');
        const dataPath = paths.data ?? 'data';
        const totalPath = paths.total ?? 'total';

        fetching = true;

        pageSize = hasPageSizeOnUrl
            ? parseInt(url.searchParams.get(params.page_size ?? 'page_size') as string)
            : newPageSize;
        page = alreadyHasPage ? parseInt(url.searchParams.get(params.page ?? 'page') as string) : page;

        if (!alreadyHasPage) url.searchParams.append(params.page ?? 'page', page.toString());
        if (!hasPageSizeOnUrl) url.searchParams.append(params.page_size ?? 'page_size', pageSize.toString());
        if (defaultSort) url.searchParams.append(params.sort ?? 'sort', defaultSort);

        const response = await context.fetch(url, {
            credentials,
        });

        const responseBody = await response.json();
        const hasMetadata = dataPath !== 'root';

        if (!hasMetadata) {
            records = responseBody;
            fetching = false;
            return;
        }

        records = get(responseBody, dataPath, []);
        total = get(responseBody, totalPath, 0);
        fetching = false;

        Events.dispatchPagination(props.id, {
            page,
            total,
            pageSize,
            recordsLength: records.length,
        });
    }

    $effect(() => {
        Events.dispatchTableFetching(props.id, fetching);
    });

    $effect(() => {
        if (!fetching) {
            loading = false;
            return;
        }

        delay(() => (loading = true), {
            if: () => fetching,
            after: commonDelay,
        });
    });
</script>

<div
    class={cn(
        commonBorderColor,
        commonBorderRadius,
        'relative overflow-hidden border bg-white dark:bg-neutral-800',
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
                {#each records as record (record[trackBy])}
                    <TableRow columns={props.columns} table={props} {record} />
                {/each}
            </tbody>
        </table>
    </div>
</div>
