<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { IconProps } from './types.js';

    const defaultIconSize = useTheme('common.defaults.icon_size', 20);
    const { name, size = defaultIconSize, content, ...props }: IconProps = $props();
    const icon = $derived(name ?? content);
</script>

<iconify-icon {icon} height={size} class={props.class}></iconify-icon>
