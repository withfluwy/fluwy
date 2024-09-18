<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Collapsible } from 'bits-ui';
    import { slide } from 'svelte/transition';
    import { useCommon } from '../common/styles.js';
    import Spacer from './spacer.svelte';
    import { Icon } from '../common/index.js';
    import type { IconProps } from '../common/icon/types.js';
    import { icon } from '../common/utils.js';
    import { page } from '$app/stores';

    interface MenuGroupProps extends ElementProps {
        header?: string;
        icon?: IconProps | string;
        trailing_icon?: IconProps | string;
        active_if_starts_with?: string;
    }

    const {
        trailing_icon = 'solar:alt-arrow-right-linear',
        active_if_starts_with,
        icon: iconProps,
        ...props
    }: MenuGroupProps = $props();
    let open = $state(true);

    const commonBorderColor = useCommon('border_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const wrapperTheme = useTheme('layout.menu_group.wrapper');
    const headerTheme = useTheme('layout.menu_group.header.default');
    const headerActiveTheme = cn('hover:bg-transparent opacity-100', useTheme('layout.menu_group.header.active'));
    const contentTheme = useTheme('layout.menu_group.content');
    const isActive = $derived(active_if_starts_with ? $page.url.pathname.startsWith(active_if_starts_with) : false);
</script>

<Collapsible.Root bind:open class={cn('flex w-full flex-col transition-all duration-75', wrapperTheme, props.class)}>
    <Collapsible.Trigger
        class={cn(
            commonBorderColor,
            commonBorderRadius,
            'flex h-10 items-center gap-2 px-3 text-sm opacity-70 transition-all duration-75 hover:opacity-100 lg:h-8',
            headerTheme,
            { [headerActiveTheme]: isActive }
        )}
    >
        {#if iconProps}
            <Icon {...icon(iconProps)} class="transition-transform" />
        {/if}

        <Render props={props.header} />

        <Spacer />
        <Icon
            {...icon(trailing_icon)}
            class={cn('transition-transform', {
                'rotate-90': open,
            })}
        />
    </Collapsible.Trigger>

    <Collapsible.Content
        transition={slide}
        class={cn(
            commonBorderColor,
            'ml-5 pl-1 opacity-0 transition-all duration-75',
            { 'opacity-100': open },
            contentTheme
        )}
    >
        <Render props={props.content} />
    </Collapsible.Content>
</Collapsible.Root>
