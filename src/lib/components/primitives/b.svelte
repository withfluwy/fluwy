<script lang="ts">
    import { Render, type ElementProps } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
</script>

<b class={cn('font-bold', props?.class)}><Render {props} /></b>
