<script lang="ts">
	import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';
	export let props: ElementProps | any[];

	$: classes = withClasses(props, 'flex flex-col');
</script>

<div class={classes}>
	<Render {props} />
</div>
