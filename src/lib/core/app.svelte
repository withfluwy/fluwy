<script lang="ts">
	import { useClient, useTheme } from './client/index.js';
	import type { RenderResponse } from './contracts.js';
	import Render from './render.svelte';
	import { useDialogs } from './stores/dialogs.js';
	import { installOperations } from './operations/index.js';
	import { Toaster } from '$lib/ui/sonner/index.js';
	import { createContext } from './context/index.js';
	import { installAdapters } from './adapters/index.js';
	import { setContext } from 'svelte';
	import Button from '../components/forms/button/button.svelte';
	import { generateColorVariables } from './utils/color/index.js';

	export let data: RenderResponse;

	const dialogs = useDialogs();
	const client = useClient();
	const context = createContext();

	installOperations(client);
	installAdapters(client);

	setContext('context', context);
	setContext('theme', data.theme);

	const colors = useTheme('colors');
	const buttonVariants = useTheme('forms.button.variants');
</script>

<div style={generateColorVariables(colors)}>
	<div class="p-10">
		{#each Object.keys(colors) as color}
			<div class="mb-4">
				<h3 class="text-sm mb-1 uppercase font-semibold">{color}</h3>
				<div class="flex items-center gap-2">
					{#each Object.keys(buttonVariants) as variant}
						<Button {variant} {color}>{variant}</Button>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<Toaster richColors position="top-right" closeButton />
	{#each $dialogs as dialog}
		<Render context={dialog.context} props={{ [dialog.component]: dialog }} />
	{/each}

	<Render props={data.content} />
</div>
