<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { exclude } from '@/lib/core/utils/index.js';

    interface RepeatProps {
        times: number;
        content?: Any;
    }

    const props: RepeatProps = $props();
</script>

{#each Array(props.times) as _, i}
    <Render props={exclude(props, 'times')} />
{/each}
