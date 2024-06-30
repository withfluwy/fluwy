<script lang="ts">
	import { useClient } from './client/index.js';
	import type { RenderResponse } from './contracts.js';
	import Render from './render.svelte';
	import { useDialogs } from './stores/dialogs.js';
	import { installOperations } from './operations/index.js';
	import { Toaster } from '$lib/ui/sonner/index.js';
	import { createContext } from './context/index.js';
	import { installAdapters } from './adapters/index.js';
	import { setContext } from 'svelte';

	export let data: RenderResponse;

	const dialogs = useDialogs();
	const client = useClient();
	const context = createContext();

	installOperations(client);
	installAdapters(client);

	setContext('context', context);
</script>

<Toaster richColors position="top-right" closeButton />
{#each $dialogs as dialog}
	<Render context={dialog.context} props={{ [dialog.component]: dialog }} />
{/each}

<Render props={data.content} />
