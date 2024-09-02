<script lang="ts">
    import type { Any } from './core/contracts.js';
    import { Render, withClasses, type ElementProps } from './core/index.js';

    export let props: ElementProps | Any[];

    $: rowClasses = withClasses(props, 'flex flex-col w-full h-full justify-center items-center');
</script>

<div class={rowClasses}>
    <Render {props} />
</div>
