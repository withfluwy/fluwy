<script lang="ts">
    import type { Template } from '@/lib/core/contracts.js';
    import { parseCondition } from '@/lib/core/controls/condition/index.js';
    import { Render, useContext } from '@/lib/core/index.js';

    interface ConditionProps {
        [condition: string]: Template;
    }

    const context = useContext();
    const props: ConditionProps = $props();
    const template = $derived(parseCondition(props, context));
</script>

<Render props={template} />
