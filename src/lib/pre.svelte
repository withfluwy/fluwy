<script lang="ts">
	import { Render, withClasses } from './core';
	import type { Any } from './core/contracts';

	export let props: Any;

	$: classes = withClasses(props, '');
</script>

<pre class={classes}><Render {props} /></pre>
