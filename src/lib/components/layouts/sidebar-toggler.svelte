<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import type { IconProps } from '../common/icon/types.js';

    interface Props extends ElementProps {
        icon?: string | IconProps;
        color?: string;
    }

    const { icon, color, ...props }: Props = $props();
    const sidebarTogglerTheme = useTheme('layout.sidebar_toggler');
    const sidebarTogglerIconTheme = useTheme('layout.sidebar_toggler_icon');
</script>

<Render
    props={{
        button: {
            class: cn('size-8 lg:hidden', sidebarTogglerTheme, props.class),
            variant: 'ghost',
            color,
            icon: icon ?? sidebarTogglerIconTheme ?? 'gravity-ui:bars',
            on_click: {
                emit: 'ToggleSidebar',
            },
        },
    }}
/>
