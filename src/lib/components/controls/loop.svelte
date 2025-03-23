<script lang="ts">
    import type { Template } from '@/lib/core/contracts.js';
    import { loop_expression } from '@/lib/core/controls/loop/index.js';
    import { Render, useContext } from '@/lib/core/index.js';

    interface LoopProps {
        [loopExpression: string]: Template;
    }

    const context = useContext();
    const props: LoopProps = $props();
    const items = $derived.by(() => loop_expression.evaluate(props, context));
</script>

{#each items as item, index (index)}
    {@const loopContext = context.cloneWith(item.context)}
    <Render props={item.template} context={loopContext} />
{/each}
