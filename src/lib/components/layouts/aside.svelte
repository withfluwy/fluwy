<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    const props: ElementProps = $props();
    const commonBorderColor = useCommon('border_color');
    const layoutAsideTheme = useTheme('layout.aside');
    let aside: HTMLDivElement;
    let top = $state('0px');
    let height = $state('100vh');

    $effect(() => {
        if (!aside) return;

        top = aside.getBoundingClientRect().top + 'px';
        height = `calc(100vh - ${top})`;
    });
</script>

<div
    id="aside"
    bind:this={aside}
    style:top
    style:height
    class={cn(
        commonBorderColor,
        'sticky z-[1] hidden h-screen w-64 shrink-0 overflow-y-auto border-l p-3 xl:block',
        layoutAsideTheme,
        props.class
    )}
>
    <Render {props} />
</div>
