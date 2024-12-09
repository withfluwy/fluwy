<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { compile, useContext } from '@/lib/core/index.js';

    const props: ElementProps = $props();
    const context = useContext();

    let content = $derived(compile(props.content, context.data));
</script>

<pre>{JSON.stringify(content, null, 2)}</pre>
