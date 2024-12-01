<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { compile, Render, useContext } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    const props: ElementProps = $props();
    const context = useContext();
    const emailTheme = useTheme('displays.email');

    const email = $derived(typeof props === 'string' ? props : props.content);
    const compiledEmail = $derived(typeof email === 'string' ? compile(email, context.data) : undefined);
    const hasEmail = $derived(typeof compiledEmail === 'string');
    const href = $derived(hasEmail ? `mailto:${compiledEmail}` : undefined);
</script>

<Render
    props={{
        link: {
            url: href,
            class: cn(emailTheme, props?.class),
            content: email,
        },
    }}
/>
