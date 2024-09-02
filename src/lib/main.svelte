<script lang="ts">
    import type { Any } from './core/contracts.js';
    import Render from './core/render.svelte';
    export let props: Any;
</script>

<div class="flex h-screen w-full flex-col">
    <Render {props} />
</div>
