<script lang="ts">
	import { Render, withClasses, type ElementProps } from './core';

	export let props: ElementProps | any[];

	$: rowClasses = withClasses(props, 'flex');
</script>

<div class={rowClasses}>
	<Render {props} />
</div>
