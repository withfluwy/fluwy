<script lang="ts">
	import { Render } from './core';
	import type { Any } from './core/contracts';

	export let props: string | Any;
</script>

<h2 class="text-3xl font-semibold">
	{#if typeof props === 'string'}
		{props}
	{:else}
		<Render {props} />
	{/if}
</h2>
