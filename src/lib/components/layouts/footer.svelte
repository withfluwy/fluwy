<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    interface FooterProps {
        class?: string;
    }

    const footerTheme = useTheme('layout.footer');

    const props: FooterProps = $props();
</script>

<div id="footer" class={cn('capitalize', footerTheme, props.class)}>footer</div>
