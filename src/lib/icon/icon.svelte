<script lang="ts">
    import type { IconProps } from './types.js';

    export let props: IconProps | string;
    export let defaultSize = 20;

    $: icon = (props as IconProps).name || props;
    $: size = (props as IconProps).size || defaultSize;
    $: className = (props as IconProps).class || '';
</script>

<iconify-icon {icon} height={size} class={className}></iconify-icon>
