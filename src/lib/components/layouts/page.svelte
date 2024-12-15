<script lang="ts">
    import { browser } from '$app/environment';
    import { useTheme } from '@/lib/core/utils/index.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    interface PageProps {
        class?: string;
        content?: Any;
    }

    const props: PageProps = $props();
    const pageTheme = useTheme('layout.page');
    const commonBackgroundColor = useCommon('background_color');

    function elementIsVisible(element: HTMLElement | null | false) {
        if (!element) return false;
        const style = getComputedStyle(element);
        return Boolean(style && style.display !== 'none');
    }

    const sidebar = $derived(browser && document?.getElementById('sidebar'));
    const aside = $derived(browser && document?.getElementById('aside'));
    const hasSidebar = $derived(elementIsVisible(sidebar));
    const hasAside = $derived(elementIsVisible(aside));
</script>

<div
    id="page"
    class={cn(commonBackgroundColor, 'h-screen overflow-auto', pageTheme, props?.class, {
        'no-sidebar': !hasSidebar,
        'no-aside': !hasAside,
    })}
>
    <Render {props} />
</div>
