<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { exclude } from '@/lib/core/utils/index.js';

    interface LinkProps {
        class?: string;
        url: string;
        open_new_tab?: boolean;
        content?: Any;
    }

    const props: LinkProps = $props();
</script>

<a href={props.url} class={props.class} target={props.open_new_tab ? '_blank' : ''}>
    <Render props={exclude(props, 'url', 'open_new_tab')} />
</a>
