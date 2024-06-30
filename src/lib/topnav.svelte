<script lang="ts">
	import type { Any } from './core/app';
	import Render from './core/render.svelte';
	import { cn } from './core/utils';

	export let props: TopnavProps;

	interface TopnavProps {
		class?: string;
		left: Any[];
		center?: Any[];
		right: Any[];
	}
</script>

<div class={cn('h-16 px-6 flex items-center justify-between', props.class)}>
	<div class="flex items-center gap-2">
		<Render props={props.left} />
	</div>

	{#if props.center}
		<div class="flex items-center gap-2">
			<Render props={props.center} />
		</div>
	{/if}

	<div class="flex items-center">
		<Render props={props.right} />
	</div>
</div>
