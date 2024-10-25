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
    import { icon } from '../common/utils.js';

    interface MenuItemProps extends ElementProps {
        icon?: IconProps | string;
        trailing_icon?: IconProps | string;
        text?: string;
        url?: string;
    }

    const { url, icon: iconProp, trailing_icon, text, ...props }: MenuItemProps = $props();
    const element = $derived(url ? 'a' : 'div');
    const isActive = $derived($page.url.pathname === url);
    const iconTheme = useTheme('layout.menu_item.icon');
    const layoutMenuItemActiveTheme = useTheme('layout.menu_item.active');
    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const layoutMenuItemDefaultTheme = useTheme('layout.menu_item.default');
    const layoutMenuItemIndicatorDefaultTheme = useTheme('layout.menu_item.indicator.default');
    const layoutMenuItemIndicatorActiveTheme = useTheme('layout.menu_item.indicator.active');

    const activeTheme = cn(
        'active bg-primary-50 dark:bg-primary/20 dark:hover:bg-primary/20 text-primary-700 dark:text-primary-400 hover:bg-primary-50 border-primary opacity-100',
        layoutMenuItemActiveTheme
    );

    const indicatorActive = cn('opacity-100', layoutMenuItemIndicatorActiveTheme);
</script>

<svelte:element
    this={element}
    href={url ? url : undefined}
    class={cn(
        commonBorderColor,
        commonBorderRadius,
        'relative flex min-h-10 w-full select-none items-center gap-2 px-3 py-1 text-sm opacity-70 transition-all duration-75 hover:bg-neutral-50 hover:opacity-100 lg:min-h-8 dark:hover:bg-neutral-800',
        layoutMenuItemDefaultTheme,
        {
            [activeTheme]: isActive,
        },
        props.class
    )}
>
    <div
        class={cn(
            'menu-item-indicator',
            commonBorderRadius,
            'pointer-events-none invisible absolute inset-x-0 -left-[6.5px] flex h-full w-1 items-center bg-primary opacity-0 transition-all duration-200',
            layoutMenuItemIndicatorDefaultTheme,
            {
                [indicatorActive]: isActive,
            }
        )}
    ></div>

    {#if iconProp}
        <Icon {...icon(iconProp, { class: iconTheme })} />
    {/if}

    <Render props={text ?? props} />

    <Spacer />

    {#if trailing_icon}
        <Icon {...icon(trailing_icon)} />
    {/if}
</svelte:element>
