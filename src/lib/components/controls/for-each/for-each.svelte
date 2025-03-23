<script lang="ts">
    import { createContext } from '$lib/core/context/index.js';
    import type { Any, ElementProps } from '$lib/core/contracts.js';
    import { compile, Render, useContext } from '$lib/core/index.js';
    import { get } from '$lib/core/utils/index.js';
    import { getContext } from 'svelte';

    interface ForEachProps extends ElementProps {
        item_of?: string;
        item_in?: string;
        as: string;
    }

    const { content, ...props }: ForEachProps = $props();
    const context = useContext();

    const [first, ...path] = (props.item_of ?? props.item_in)?.split('.') ?? [];

    let items = $state([]);

    $effect(() => {
        if (first.startsWith('$') && !first.match(/\{/)) {
            const variable = getContext(first.replace('$', '')) as Any;
            items = path.length ? get(variable, path.join('.')) : variable;
        } else {
            items = compile(first, context);
        }
    });

    function createContextWith(entry: [string, Any]) {
        const context = createContext();
        const [key, value] = entry;
        const [nameForTheKey, nameForTheValue] = props.as.split(',').map((s) => s.trim());

        context.set(nameForTheKey, nameForTheValue ? key : value);
        if (nameForTheValue) context.set(nameForTheValue, value);

        return context;
    }
</script>

{#if items && (items?.length || Object.keys(items).length)}
    {#each Object.entries(items) as entry, index (index)}
        <Render props={content} context={createContextWith(entry)} />
    {/each}
{/if}
