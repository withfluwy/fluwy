<script lang="ts">
    import { DropdownMenu } from 'bits-ui';
    import { type ElementProps, Render, useClient, useContext } from '$lib/core/index.js';
    import { cn, flyAndScale } from '$lib/core/utils/index.js';
    import Icon from '$lib/components/common/icon/icon.svelte';
    import type { IconProps } from '../icon/types.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { Dropdown } from './styles.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { useCommon } from '../styles.js';

    const props: DropdownItemProps = $props();

    interface DropdownItemProps extends ElementProps {
        icon?: string;
        sub_content?: unknown;
        text?: string;
        on_click?: Any;
    }

    const itemClasses = cn(useCommon('border_color'), Dropdown.Item, useTheme('common.dropdown.item'), props?.class);
    const client = useClient();
    const context = useContext();
    const dropdownContent = cn(
        useCommon('border_color'),
        useCommon('foreground_color'),
        Dropdown.Content,
        useTheme('common.dropdown.content')
    );
    const arrowIcon = $state(useTheme('common.dropdown.arrow_icon_right', Dropdown.ArrowIconRight));

    async function onClick() {
        if (!props.on_click) return;

        await client.handleOperations(props.on_click, context);
    }

    function getIcon(propValue: Any): IconProps {
        if (typeof propValue === 'string') return { name: propValue };

        return propValue;
    }
</script>

{#if props.sub_content}
    <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger class={itemClasses}>
            {#if props.icon}
                <Icon size={16} {...getIcon(props.icon)} />
            {/if}

            <div class="w-full">
                <Render props={props.text ?? props.content} />
            </div>
            <Icon size={16} name={arrowIcon} />
        </DropdownMenu.SubTrigger>

        <DropdownMenu.SubContent class={dropdownContent} transition={flyAndScale}>
            <Render props={props.sub_content} />
        </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
{:else}
    <DropdownMenu.Item class={itemClasses} on:click={onClick}>
        {#if props.icon}
            <Icon size={16} {...getIcon(props.icon)} />
        {/if}

        {#if props.text}
            <div class="w-full">{props.text}</div>
        {:else}
            <div>
                <Render {props} />
            </div>
        {/if}
    </DropdownMenu.Item>
{/if}
