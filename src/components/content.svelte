<script>
    import Render from '@/lib/core/render.svelte';

    const props = $props();
</script>

<div class="doc-content">
    <Render {props} />
</div>
