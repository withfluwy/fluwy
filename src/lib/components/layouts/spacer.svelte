<script lang="ts">
    import { cn } from '@/lib/core/utils/index.js';

    interface SpacerProps {
        class?: string;
    }

    const props: SpacerProps = $props();

    const classes = $derived(cn('flex-1', props.class));
</script>

<div class={classes}></div>
