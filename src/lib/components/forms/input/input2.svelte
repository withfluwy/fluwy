<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import type { InputProps } from '../contracts.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { Icon } from '@/lib/components/common/index.js';
    import { mergeThemes, useTheme } from '@/lib/core/utils/index.js';
    import { Common, useCommon } from '@/lib/components/common/styles.js';
    import { Render, useContext } from '@/lib/core/index.js';
    import { DefaultSize, Sizes } from '../styles.js';
    import type { FormState } from '@/lib/components/forms/form/types.js';
    import { onMount } from 'svelte';
    import { app } from '@/lib/index.js';

    import { Input } from './input.js';
    import { useChangeNotifier } from '@/lib/core/adapters/svelte.js';

    let {
        field,
        oninput,
        label,
        size,
        description,
        width_dynamic,
        error_path,
        value: incomingValue = $bindable(),
        on_input,
        ...props
    }: InputProps = $props();

    // Theme and styling setup
    const spinner = useTheme('common.spinner', Common.spinner);
    const commonBorderColor = useCommon('border_color');
    const commonBackgroundColor = useCommon('background_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const sizes = mergeThemes('forms.common.sizes', Sizes);
    const defaultSize = mergeThemes('forms.common.default_size', DefaultSize);
    const context = useContext();

    // Use the changeNotifier adapter for reactive integration
    const input = useChangeNotifier(new Input({
        field,
        initialValue: incomingValue,
        icon: props.icon,
        trailing_icon: props.trailing_icon,
        loading: props.loading,
        disabled: props.disabled,
        app,
        operations: on_input,
        context,
    }));

    // Form context setup
    let form: FormState =
        context.get('form') ??
        ({
            data: {
                [$input.field]: $input.value ?? '',
            },
            errors: {},
            pristine: true,
        } satisfies FormState);

    // Update the input model with form reference and data
    $input.updateConfig({ form: form });
    if (context.get('form')) {
        $input.updateFromForm(form, error_path);
    }

    // DOM references
    let inputElement = $state<HTMLInputElement | null>(null);
    let sizer = $state<HTMLSpanElement | null>(null);

    const inputLabelTheme = cn(
        'flex justify-between text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200',
        useTheme('forms.input.label')
    );

    const iconDefaultClasses =
        'absolute pointer-events-none peer-disabled:opacity-50 text-neutral-400 transition duration-100 peer-focus:text-primary';
    const iconErrorClasses = 'text-destructive peer-focus:text-destructive';
    const inputBaseTheme = useTheme('forms.input.base');
    const inputWrapperTheme = useTheme('forms.input.wrapper');

    const inputDescriptionTheme = cn(
        'text-sm flex justify-between mt-1 text-neutral-500 dark:text-neutral-400',
        useTheme('forms.input.description')
    );
    const inputErrorsTheme = cn(
        'mt-0.5 text-sm text-destructive placeholder:text-red-500',
        useTheme('forms.input.errors')
    );

    // Handle dynamic width calculation - only when user types
    let lastCalculatedWidth = 'auto';
    $effect(() => {
        if (!width_dynamic || !sizer) return;

        // eslint-disable-next-line svelte/no-dom-manipulating
        sizer.textContent = $input.value?.toString() || '';
        if (inputElement) {
            sizer.style.fontSize = getComputedStyle(inputElement).fontSize;
        }
        const padding = 20;
        const newWidth = `${Math.max(sizer.offsetWidth + padding, 36)}px`;

        // Only update if the width actually changed to prevent loops
        if (newWidth !== lastCalculatedWidth) {
            lastCalculatedWidth = newWidth;
            $input.setDynamicWidth(newWidth);
        }
    });

    onMount(() => {
        // Initialize errors from props or form only once on mount
        const initialErrors = props.errors ?? (form.errors[error_path ?? $input.field] || []);
        if (initialErrors.length > 0) {
            $input.setErrors(initialErrors);
        }
    });

    // Handle input events - component level then delegate to domain model
    async function onInput(e: Event) {
        // Call the component-level oninput handler if provided
        oninput?.(e);

        // Then delegate to the Input domain model
        await $input.handleInput(e);
    }
</script>

<div class={cn('w-full flex-1', inputWrapperTheme)}>
    {#if label}
        <label for={$input.id} class={inputLabelTheme}>
            <Render props={label} />
        </label>
    {/if}

    {#if width_dynamic}
        <span
            bind:this={sizer}
            class="pointer-events-none invisible absolute border border-red-500 whitespace-pre opacity-30"
            style="font: inherit; padding: 0;"
        ></span>
    {/if}

    <div class="relative flex items-center">
        <input
            id={$input.id}
            bind:this={inputElement}
            {...props}
            class={cn(
                commonBorderColor,
                commonBackgroundColor,
                commonBorderRadius,
                sizes[size || defaultSize],
                'peer ring-primary focus:border-primary w-full border shadow-xs outline-hidden transition-all duration-200 ring-inset focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
                inputBaseTheme,
                props.class,
                { 'pl-9': $input.theme.hasIcon },
                { 'pr-9': $input.theme.hasTrailingIcon },
                { 'border-destructive! ring-destructive focus:border-destructive': $input.errors?.length },
                { 'min-w-9 p-0 text-center': width_dynamic }
            )}
            value={$input.value}
            disabled={$input.disabled}
            oninput={onInput}
            style:width={width_dynamic ? $input.theme.inputWidth : undefined}
        />

        {#if $input.theme.hasIcon && props.icon}
            <Icon
                name={props.icon}
                class={cn('left-2.5', iconDefaultClasses, { [iconErrorClasses]: $input.errors?.length })}
            />
        {/if}

        {#if $input.theme.hasTrailingIcon}
            <Icon
                name={$input.loading ? spinner : (props.trailing_icon || '')}
                class={cn('right-2.5', iconDefaultClasses, { [iconErrorClasses]: $input.errors?.length })}
            />
        {/if}
    </div>

    {#if $input.errors?.length}
        <div transition:fade class="flex flex-col transition-all duration-200">
            {#each $input.errors as error, index (index)}
                <span transition:slide|global={{ duration: 150 }} class={inputErrorsTheme}>
                    {error}
                </span>
            {/each}
        </div>
    {/if}

    {#if description}
        <div class={cn('inline-flex flex-wrap', inputDescriptionTheme)}>
            <Render props={description} />
        </div>
    {/if}
</div>
