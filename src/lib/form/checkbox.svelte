<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { withClasses } from '../core';

	export let props: CheckboxProps | string;
	export let value: boolean;

	interface CheckboxProps {
		label: string;
		class?: string;
		errors?: string[];
	}

	$: errors = (props as CheckboxProps).errors;

	$: classes = withClasses(
		props as CheckboxProps,
		'inline-flex flex-wrap items-center gap-3 rounded-lg cursor-pointer'
	);
</script>

<div>
	<label class={classes}>
		<input type="checkbox" class="h-4 w-4" bind:value />
		<span>{typeof props === 'string' ? props : props.label}</span>
	</label>

	{#if errors?.length}
		<div transition:fade class="mt-0.5 flex flex-col gap-1">
			{#each errors as error}
				<div transition:slide|global={{ duration: 150 }} class="text-xs text-destructive">
					{error}
				</div>
			{/each}
		</div>
	{/if}
</div>
