<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn } from '@/lib/core/utils/index.js';
    import type { IconProps } from '../common/icon/types.js';
    import { page } from '$app/stores';
    import { Render } from '@/lib/core/index.js';
    import { Icon } from '../common/index.js';
    import Spacer from './spacer.svelte';
    import { useCommon } from '../common/styles.js';
    import { useTheme } from '@/lib/core/client/index.js';

    interface MenuItemProps extends ElementProps {
        icon?: IconProps | string;
        trailing_icon?: IconProps | string;
        text?: string;
        url?: string;
    }

    const { url, icon: iconProp, trailing_icon, text, ...props }: MenuItemProps = $props();
    const element = $derived(url ? 'a' : 'div');
    const isActive = $derived($page.url.pathname === url);

    const defaultTheme = cn(
        'flex w-full select-none items-center gap-2 p-3 opacity-70 transition-all duration-75 hover:bg-gray-50 hover:opacity-100 dark:[&.active]:hover:bg-primary dark:[&:not(.active)]:hover:bg-gray-800 dark:[&:not(.active)]:hover:text-white',
        useTheme('layout.menu_item.default')
    );
    const activeTheme = cn(
        'active bg-primary text-primary-contrast border-primary font-bold opacity-100',
        useTheme('layout.menu_item.active')
    );

    function icon(givenIcon: IconProps | string): IconProps {
        if (typeof givenIcon === 'string') {
            return { name: givenIcon };
        }

        return givenIcon as IconProps;
    }
</script>

<svelte:element
    this={element}
    href={url ? url : undefined}
    class={cn(useCommon('border_color'), useCommon('border_radius.md'), defaultTheme, {
        [activeTheme]: isActive,
    })}
>
    {#if iconProp}
        <Icon {...icon(iconProp)} />
    {/if}

    <Render props={text ?? props} />

    <Spacer />

    {#if trailing_icon}
        <Icon {...icon(trailing_icon)} />
    {/if}
</svelte:element>
