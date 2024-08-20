<script lang="ts">
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
</script>

<div class={cn('flex w-full', props.class)}>
    <Render {props} />
</div>
