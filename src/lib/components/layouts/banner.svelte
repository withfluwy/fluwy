<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    interface BannerProps {
        class?: string;
    }

    const bannerTheme = useTheme('layout.banner');

    const props: BannerProps = $props();
</script>

<div id="banner" class={cn('', bannerTheme, props.class)}>
    <Render {props} />
</div>
