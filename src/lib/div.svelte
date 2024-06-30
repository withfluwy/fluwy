<script lang="ts">
	import { Render, withClasses, type ElementProps } from './core';

	export let props: ElementProps | any[];

	$: classes = withClasses(props, '');
</script>

<div class={classes}>
	<Render {props} />
</div>
