<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import { Render } from '@/lib/core/index.js';
    import { cn } from '@/lib/core/utils/index.js';

    interface BrandProps {
        light: string;
        dark?: string;
        url: string;
        class?: string;
    }

    const { light, dark, url, ...props }: BrandProps = $props();
    const brandTheme = useTheme('layout.brand');

    const schema = $derived({
        link: {
            url,
            image: {
                class: cn('h-8', brandTheme, props.class),
                src: {
                    light,
                    dark: dark ?? light,
                },
            },
        },
    });
</script>

<Render props={schema} />
