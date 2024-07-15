<script lang="ts">
    import Button from './components/forms/button/button.svelte';
    import { type IconProps } from './icon/index.js';

    export let props: SidenavToggleProps;

    interface SidenavToggleProps {
        icon: IconProps;
    }

    const icon: IconProps = {
        name: props.icon?.name ?? 'solar:hamburger-menu-linear',
        size: props.icon?.size ?? 24,
        ...props,
    };
</script>

<Button {...{ icon_left: icon, class: 'h-9 w-9', shape: 'ghost' }}></Button>
