<script lang="ts">
    import type { Any, Component } from '@/lib/core/contracts.js';
    import { cn, deferred } from '@/lib/core/utils/index.js';
    import { Icon, type IconProps } from '../../common/icon/index.js';
    import { useClient, mergeThemes } from '../../../core/client/index.js';
    import { useContext } from '../../../core/context/index.js';
    import { type Snippet } from 'svelte';
    import { compile, Render, type ElementProps } from '@/lib/core/index.js';
    import { setCurrentColor } from '@/lib/core/utils/color/index.js';
    import { BorderRadius, Sizes, Variants } from './styles.js';
    import { Colors } from '@/lib/core/styles.js';

    interface ButtonProps extends ElementProps {
        text?: string;
        icon_left?: IconProps | string;
        icon_right?: IconProps | string;
        loading?: boolean;
        disabled?: boolean;
        class?: string;
        variant?: string;
        size?: string;
        color?: string;
        on_click?: Any;
        onclick?: () => Any;
        component?: Partial<Component>;
        children?: Snippet;
    }

    const { component, children, ...props }: ButtonProps = $props();

    const componentName = component?.name ?? 'button';
    const context = useContext();
    const client = useClient();

    const sizes = mergeThemes('forms.common.sizes', Sizes);
    const colors = mergeThemes('colors', Colors);
    const variants = mergeThemes(`forms.${componentName}.variants`, Variants);
    const defaultSize = mergeThemes('forms.common.default_size', 'md');
    const borderRadius = mergeThemes('forms.common.border_radius', BorderRadius);

    let innerLoading = false;

    let text = $derived(compile(props.text ?? '', context.data));
    let size = $derived(compile(props.size || defaultSize, context.data));
    let color = $derived(compile(props.color || 'default', context.data));
    let variant: keyof typeof Variants = $derived(compile(props.variant || 'filled', context.data));
    let loading = $derived(props.loading || innerLoading);
    let disabled = $derived(props.disabled || loading);

    async function handleClick(e: MouseEvent) {
        if (!props.on_click) {
            return props.onclick?.();
        }

        e.stopPropagation();

        let done = false;

        deferred(() => (innerLoading = !done));

        try {
            return await client.handleOperations(props.on_click, context);
        } catch (error) {
            console.error(error);
        } finally {
            innerLoading = false;
            done = true;
        }
    }

    let setButtonColor = $derived(
        color === 'default' ? setCurrentColor('gray', colors) : setCurrentColor(color, colors)
    );
    let defaultColorClasses: typeof Variants = $derived(
        color === 'default'
            ? {
                  filled: 'text-color-900 focus:ring-color-300 bg-color-contrast enabled:hover:bg-color-100 border-color-300',
                  outline: 'text-color-900 focus:ring-color-400 border-color-400',
                  ghost: 'text-color-900 focus:ring-color-300 enabled:hover:bg-color-100',
                  link: 'text-color-900 focus:ring-color-300',
              }
            : ({} as typeof Variants)
    );

    function getIcon(propValue: Any): IconProps {
        if (typeof propValue === 'string') return { name: propValue };

        return propValue as IconProps;
    }
</script>

<button
    onclick={handleClick}
    class={cn(
        `flex items-center justify-center gap-1 shadow-sm transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-color focus:ring-offset-2 enabled:active:scale-[0.99]`,
        sizes[size],
        variants[variant],
        borderRadius[size],
        defaultColorClasses[variant],
        props.class,
        disabled ? 'hover:none cursor-not-allowed opacity-50' : ''
    )}
    {disabled}
    style={setButtonColor}
>
    {#if props.icon_left && !loading}
        <Icon {...getIcon(props.icon_left)} />
    {:else if loading}
        <Icon {...{ name: 'svg-spinners:90-ring-with-bg' }} />
    {/if}

    {#if props.content}
        <Render props={props.content} />
    {:else if text}
        <Render props={text} />
    {/if}

    {#if props.icon_right}
        <Icon {...getIcon(props.icon_right)} />
    {/if}

    {#if children}
        {@render children()}
    {/if}
</button>
