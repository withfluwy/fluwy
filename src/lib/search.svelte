<script lang="ts">
    import { cn } from './core/utils/index.js';
    import { Input } from './form/index.js';

    export let props: SearchProps;

    interface SearchProps {
        icon?: string;
        url?: string;
        class?: string;
    }

    $: icon = props.icon || 'solar:magnifer-linear';
</script>

<Input placeholder="Search..." {icon} class={cn('w-96', props.class)} />
