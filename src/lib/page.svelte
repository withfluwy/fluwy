<script lang="ts">
    import { Render, type ElementProps } from './core/index.js';
    import { cn, exclude } from './core/utils/index.js';
    import PageTitle from './page_title.svelte';

    export let props: PageProps;

    interface PageProps {
        header: string | ElementProps;
        class?: string;
    }
</script>

<div class={cn('px-16 py-6', props.class)}>
    <div
        class={cn(
            'mb-8 flex items-center justify-between gap-3',
            typeof props.header === 'string' ? '' : props.header?.class
        )}
    >
        {#if typeof props.header === 'string'}
            <PageTitle props={props.header} />
        {:else}
            <Render props={props.header} />
        {/if}
    </div>
    <Render props={exclude(props, 'header')} />
</div>
