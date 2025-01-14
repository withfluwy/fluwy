<script lang="ts">
    import { Render, useContext } from '@/lib/core/index.js';
    import type { Template } from '@/lib/core/contracts.js';
    import { evaluate } from '@/lib/core/expressions/evaluate.js';

    interface ExpressionProps {
        value?: string;
        template: Template;
    }

    const context = useContext();
    const { value: expression, template }: ExpressionProps = $props();

    console.log('expression', $state.snapshot({ expression, template }), context.data);
</script>

{#if expression?.startsWith('if ')}
    {#if evaluate(expression, context)}
        <Render props={template} />
    {/if}
{/if}
