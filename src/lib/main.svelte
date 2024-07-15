<script lang="ts">
    import Render from './core/render.svelte';
    export let props: any;
</script>

<div class="flex h-screen w-full flex-col">
    <Render {props} />
</div>
