<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { compile, Render, useContext } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    const context = useContext();
    const phoneTheme = useTheme('displays.phone');

    const phone = $derived(typeof props === 'string' ? props : props.content);
    const compiledPhone = $derived(typeof phone === 'string' ? compile(phone, context.data) : undefined);
    const hasPhone = $derived(typeof compiledPhone === 'string');
    const href = $derived(hasPhone ? `tel:${compiledPhone}` : undefined);
</script>

<Render
    props={{
        link: {
            url: href,
            class: cn(phoneTheme, props?.class),
            content: phone,
        },
    }}
/>
