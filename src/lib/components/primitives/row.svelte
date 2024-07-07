<script lang="ts">
	import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';

	const props: ElementProps | any[] = $props();

	const rowClasses = $derived(withClasses(props, 'flex'));
</script>

<div class={rowClasses}>
	<Render {props} />
</div>
