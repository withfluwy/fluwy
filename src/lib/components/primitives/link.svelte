<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn, exclude } from '@/lib/core/utils/index.js';

    interface LinkProps {
        class?: string;
        url: string;
        open_new_tab?: boolean;
        content?: Any;
    }

    const props: LinkProps = $props();
    const linkTheme = useTheme('typography.link');
</script>

<a href={props.url} class={cn(linkTheme, props.class)} target={props.open_new_tab ? '_blank' : ''}>
    <Render props={exclude(props, 'url', 'open_new_tab')} />
</a>
