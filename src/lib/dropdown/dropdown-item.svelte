<script lang="ts">
    import { DropdownMenuItem, Sub, SubContent, SubTrigger } from '$lib/ui/dropdown-menu/index.js';
    import { type ElementProps, Render, useClient, useContext } from '../core/index.js';
    import { cn } from '../core/utils/index.js';
    import Icon from '../components/common/icon/icon.svelte';

    export let props: DropdownItemProps;

    interface DropdownItemProps extends ElementProps {
        icon?: string;
        sub_content?: unknown;
        text?: string;
        on_click?: any;
    }

    $: itemClasses = cn('gap-2 text-nowrap', props?.class);

    const client = useClient();
    const context = useContext();

    async function onClick() {
        if (!props.on_click) return;

        await client.handleOperations(props.on_click, context);
    }
</script>

{#if props.sub_content}
    <Sub>
        <SubTrigger class={itemClasses}>
            {#if props.icon}
                <Icon props={props.icon} defaultSize={16} />
            {/if}

            <Render props={props.text ?? props.content} />
        </SubTrigger>

        <SubContent class="text-nowrap">
            <Render props={props.sub_content} />
        </SubContent>
    </Sub>
{:else}
    <DropdownMenuItem class={itemClasses} on:click={onClick}>
        {#if props.icon}
            <Icon props={props.icon} defaultSize={16} />
        {/if}

        {#if props.text}
            {props.text}
        {:else}
            <div>
                <Render {props} />
            </div>
        {/if}
    </DropdownMenuItem>
{/if}
