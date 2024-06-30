<script lang="ts">
	import Render from './core/render.svelte';
	export let props: any;
</script>

<div class="flex flex-col w-full h-screen">
	<Render {props} />
</div>
