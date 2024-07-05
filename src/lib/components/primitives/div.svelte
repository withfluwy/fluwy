<script lang="ts">
	import { Render, withClasses, type ElementProps } from '@/lib/core/index.js';

	export let props: ElementProps | any[];

	$: classes = withClasses(props, '');
</script>

<div class={classes}>
	<Render {props} />
</div>
