<script>
    import { page } from '$app/state';
    import Tabs from './tabs.svelte';

    const props = $props();
</script>

<!-- 
    DO NOT REMOVE THIS WRAPPER. This wrapper is important to force a remount of tabs upon navigation. This is to prevent 
    a bug where the tabs were being mounted and reused incorrectly. They were not being rendered properly.
-->
{#key page.url.pathname}
    <Tabs {...props} />
{/key}
