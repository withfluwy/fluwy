<script lang="ts">
    import type { Any, Component } from '@/lib/core/contracts.js';
    import { cn, deferred } from '@/lib/core/utils/index.js';
    import { Icon, type IconProps } from '../../../icon/index.js';
    import { useClient, useTheme } from '../../../core/client/index.js';
    import { useContext } from '../../../core/context/index.js';
    import { type Snippet } from 'svelte';
    import { compile, Render, type ElementProps } from '@/lib/core/index.js';
    import { setCurrentColor } from '@/lib/core/utils/color/index.js';
    import { ButtonSizes, ButtonVariants } from './styles.js';

    interface ButtonProps extends Omit<ElementProps, 'content'> {
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
        onclick?: Function;
        component?: Partial<Component>;
        children?: Snippet;
    }

    const { component, children, ...props }: ButtonProps = $props();

    const componentName = component?.name ?? 'button';
    const context = useContext();

    const variants = useTheme(`forms.${componentName}.variants`, ButtonVariants);
    const defaultSize = useTheme('forms.common.default_size', 'md');
    const sizes = useTheme('forms.common.sizes', ButtonSizes);
    const colors = useTheme('colors');
    const client = useClient();

    let innerLoading = false;

    let variant = $derived(compile(props.variant || 'default', context.data));
    let color = $derived(compile(props.color || 'primary', context.data));
    let size = $derived(compile(props.size || defaultSize, context.data));
    let loading = $derived(props.loading || innerLoading);
    let disabled = $derived(props.disabled || loading);
    let content = $derived(compile(props.text ?? '', context.data));

    async function handleClick(e: MouseEvent) {
        if (!props.on_click) {
            return props.onclick?.(e);
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

    function getButtonColor() {
        if (color === 'default') return '--color: 255 255 255; --color-contrast: 0 0 0';

        return setCurrentColor(color, colors);
    }
</script>

<button
    onclick={handleClick}
    class={cn(
        `flex items-center justify-center gap-1 rounded-lg shadow-sm transition-all duration-75 enabled:active:scale-[0.99]`,
        variants[variant],
        sizes[size],
        props.class,
        disabled ? 'hover:none cursor-not-allowed opacity-50' : ''
    )}
    {disabled}
    style={getButtonColor()}
>
    {#if props.icon_left && !loading}
        <Icon props={props.icon_left} />
    {:else if loading}
        <Icon props={{ name: 'svg-spinners:90-ring-with-bg' }} />
    {/if}

    {#if content}
        <Render props={content} />
    {/if}

    {#if props.icon_right}
        <Icon props={props.icon_right} />
    {/if}

    {#if children}
        {@render children()}
    {/if}
</button>
