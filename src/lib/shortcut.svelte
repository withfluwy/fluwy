<script lang="ts">
    // TODO: fix hotkeys usage
    // import hotkeys from 'hotkeys-js';
    import { onDestroy, onMount } from 'svelte';

    export let props: string;

    $: keys = props.split('+');

    const icons: Record<string, string> = {
        command: 'ic:baseline-keyboard-command-key',
    };

    onMount(() => {
        // hotkeys(props, (event, handler) => {
        //     event.preventDefault();
        // });
    });

    onDestroy(() => {
        // hotkeys.unbind(props);
    });
</script>

<div class="ml-auto flex items-center gap-1 text-neutral-500">
    {#each keys as shortcut}
        {#if icons[shortcut]}
            <iconify-icon icon={icons[shortcut]} class="h-6 w-6 rounded bg-white p-1 shadow-sm"></iconify-icon>
        {:else}
            <div class="flex h-6 min-w-6 items-center justify-center rounded bg-white p-1 shadow-sm">
                {shortcut}
            </div>
        {/if}
    {/each}
</div>
