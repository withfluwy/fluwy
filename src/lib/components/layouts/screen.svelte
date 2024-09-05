<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import type { Any } from '@/lib/core/contracts.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';

    interface ScreenProps {
        class?: string;
        content?: Any;
        banner?: Any;
        header?: Any;
    }

    const commonBorderColor = useCommon('border_color');
    const screenTheme = useTheme('layout.screen');
    const screenHeaderTheme = useTheme('layout.screen.header');

    const { banner, header, ...props }: ScreenProps = $props();
</script>

<div class={cn('fixed inset-0 flex h-screen flex-col overflow-auto', screenTheme, props?.class)}>
    {#if banner || header}
        <div class="sticky top-0">
            {#if banner}
                <section class="bg-primary p-4 text-white">
                    <Render props={banner} />
                </section>
            {/if}

            {#if header}
                <section
                    class={cn(
                        'flex items-center justify-between gap-3 bg-gray-100/50 px-6 py-4 shadow-sm backdrop-blur dark:bg-gray-800/80',
                        commonBorderColor,
                        screenHeaderTheme,
                        header.class
                    )}
                >
                    <Render props={header} />
                </section>
            {/if}
        </div>
    {/if}

    <Render {props} />

    <section class="sticky bottom-0 mt-auto bg-black p-4 text-center text-white">FOOTER</section>
</div>
