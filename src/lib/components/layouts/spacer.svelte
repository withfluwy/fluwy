<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    const cssClass = $derived(props.class ? props.class : props.content);
</script>

<div class={cn('flex-1', cssClass)}></div>
