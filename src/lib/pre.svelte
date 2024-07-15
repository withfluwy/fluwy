<script lang="ts">
    import { Render, withClasses } from './core/index.js';
    import type { Any } from './core/contracts.js';

    export let props: Any;

    $: classes = withClasses(props, '');
</script>

<pre class={classes}><Render {props} /></pre>
