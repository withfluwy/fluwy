<script lang="ts">
    import { Render } from '../core/index.js';
    import { useContext } from '../core/context/index.js';
    import { get } from '../core/utils/index.js';

    export let props: IfProps;

    interface IfProps {
        if: string;
        then: string;
        else: string;
    }

    const context = useContext();

    $: condition = get(context.data, props.if);
</script>

{#if condition}
    <Render props={props.then} />
{:else if props.else}
    <Render props={props.else} />
{/if}
