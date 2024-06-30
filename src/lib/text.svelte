<script lang="ts">
	import { Render, type ElementProps } from './core';

	export let props: ElementProps | string;

	$: classes = (props as ElementProps)?.class || '';
</script>

<span class={classes}><Render {props} /></span>
