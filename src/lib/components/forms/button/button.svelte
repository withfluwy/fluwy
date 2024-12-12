<script lang="ts">
    import type { Any } from '@/lib/core/contracts.js';
    import { cn, deferred } from '@/lib/core/utils/index.js';
    import { Icon, type IconProps } from '@/lib/components/common/icon/index.js';
    import { useClient, mergeThemes, useTheme } from '@/lib/core/client/index.js';
    import { compile, Render, useContext } from '@/lib/core/index.js';
    import { setCurrentColor } from '@/lib/core/utils/color/index.js';
    import { Variants } from './styles.js';
    import { Sizes, DefaultSize } from '@/lib/components/forms/styles.js';
    import { Colors } from '@/lib/core/styles.js';
    import { useCommon, Common } from '@/lib/components/common/styles.js';
    import { fade } from 'svelte/transition';
    import type { FormState } from '@/lib/components/forms/form/types.js';
    import type { ButtonProps } from '@/lib/components/forms/button/types.js';

    const { component, children, type = 'button', ...props }: ButtonProps = $props();

    const componentName = component?.name ?? 'button';
    const context = useContext();
    const client = useClient();
    const form: FormState | undefined = context.get('form');

    const sizes = mergeThemes('forms.common.sizes', Sizes);
    const colors = mergeThemes('colors', Colors);
    const variants = mergeThemes(`forms.${componentName}.variants`, Variants);
    const defaultSize = mergeThemes('forms.common.default_size', DefaultSize);
    const commonBorderRadiuses = useCommon('border_radius');
    const commonBorderColor = useCommon('border_color');
    const spinner = useTheme('common.spinner', Common.spinner);

    let innerLoading = $state(false);
    let innerDisabled = $state(false);

    let text = $derived(compile(props.text ?? '', context.data));
    let size = $derived(compile(props.size || defaultSize, context.data));
    let color = $derived(compile(props.color || 'default', context.data));
    let variant: keyof typeof Variants = $derived(compile(props.variant || 'filled', context.data));
    let loading = $derived(props.loading || innerLoading);
    let disabled = $derived(props.disabled || loading || innerDisabled);

    /**
     * This effect applies the same loading and disabled state if the button is a submit button and is inside a form
     * that is currently submitting.
     */
    $effect(() => {
        if (type !== 'submit') return;

        innerDisabled = form?.is_submitting ?? false;
        deferred(() => (innerLoading = form?.is_submitting ?? false));
    });

    async function handleClick(e: MouseEvent) {
        if (!props.on_click) {
            return props.onclick?.();
        }

        e.stopPropagation();

        let done = false;

        innerDisabled = true;

        deferred(() => (innerLoading = !done));

        try {
            return await client.handleOperations(props.on_click, context);
        } finally {
            innerLoading = false;
            done = true;
            innerDisabled = false;
        }
    }

    let setButtonColor = $derived(
        color === 'default' ? setCurrentColor('gray', colors) : setCurrentColor(color, colors)
    );
    let defaultColorClasses: typeof Variants = $derived(
        color === 'default'
            ? {
                  filled: 'text-color-900 dark:text-color-contrast focus:ring-color-200 dark:focus:ring-color-700 bg-color-contrast dark:bg-color-700/50 enabled:hover:bg-color-100 enabled:dark:hover:bg-color-700 border-color-200 dark:border-color-700',
                  outline:
                      'text-color-900 dark:text-color-contrast enabled:bg-white enabled:dark:bg-color-700/50 enabled:hover:bg-color-100 enabled:dark:hover:bg-color-700 focus:ring-color dark:focus:ring-color border-color-400 dark:border-color-400',
                  ghost: 'text-color-900 dark:text-color-contrast/75 enabled:dark:hover:text-color-contrast focus:ring-color-200 dark:focus:ring-color-700 enabled:hover:bg-color-100 enabled:dark:hover:bg-color-700 border-transparent dark:border-transparent',
                  link: 'text-color-900 underline decoration-color-500 enabled:hover:decoration-2 dark:text-color-contrast focus:ring-color-200',
              }
            : ({} as typeof Variants)
    );

    function getIcon(propValue: Any): IconProps {
        if (typeof propValue === 'string') return { name: propValue };

        return propValue as IconProps;
    }
</script>

{#snippet content()}
    {#if props.content}
        <div class={cn({ 'opacity-0 transition-all duration-150': loading })}><Render props={props.content} /></div>
    {:else if text}
        <div class={cn({ 'opacity-0 transition-all duration-150': loading })}><Render props={text} /></div>
    {/if}
{/snippet}

<button
    onclick={handleClick}
    {type}
    class={cn(
        commonBorderColor,
        `relative flex shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap shadow-sm ring-offset-white transition-all duration-75 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-color focus:ring-offset-2 enabled:active:scale-[0.99] dark:ring-offset-black`,
        sizes[size],
        variants[variant],
        commonBorderRadiuses[size],
        defaultColorClasses[variant],
        props.class,
        disabled ? 'hover:none cursor-not-allowed opacity-50 hover:opacity-50' : ''
    )}
    {disabled}
    style={setButtonColor}
>
    {#if props.icon}
        <Icon {...getIcon(props.icon)} class={cn({ 'opacity-0 transition-all duration-150': loading })} />
    {/if}

    {#if loading}
        <div transition:fade={{ duration: 200 }} class={cn('absolute inset-0 flex items-center justify-center')}>
            <Icon name={spinner} />
        </div>
    {/if}

    {@render content()}

    {#if props.trailing_icon}
        <Icon {...getIcon(props.trailing_icon)} class={cn({ 'opacity-0 transition-all duration-150': loading })} />
    {/if}

    {#if children}
        <div class={cn({ 'opacity-0 transition-all duration-150': loading })}>{@render children()}</div>
    {/if}
</button>
