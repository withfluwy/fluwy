<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import type { InputProps } from '../contracts.js';
    import { cn, expandObject, get, Random } from '@/lib/core/utils/index.js';
    import { Icon } from '@/lib/components/common/index.js';
    import { mergeThemes, useTheme } from '@/lib/core/utils/index.js';
    import { Common, useCommon } from '@/lib/components/common/styles.js';
    import { Render, useContext } from '@/lib/core/index.js';
    import { DefaultSize, Sizes } from '../styles.js';
    import type { FormState } from '@/lib/components/forms/form/types.js';
    import { onMount } from 'svelte';

    let {
        field,
        oninput,
        label,
        size,
        description,
        width_dynamic,
        error_path,
        value: incomingValue = $bindable(),
        ...props
    }: InputProps = $props();

    const id = Random.id();
    const spinner = useTheme('common.spinner', Common.spinner);
    const commonBorderColor = useCommon('border_color');
    const commonBackgroundColor = useCommon('background_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const sizes = mergeThemes('forms.common.sizes', Sizes);
    const defaultSize = mergeThemes('forms.common.default_size', DefaultSize);
    const context = useContext();

    let form: FormState =
        context.get('form') ??
        ({
            data: {
                [field ?? id]: incomingValue ?? '',
            },
            errors: {},
            pristine: true,
        } satisfies FormState);
    let initialValue = $state(incomingValue);
    let value = $state(form.data[field ?? id]);
    let inputWidth = $state('auto');
    let input = $state<HTMLInputElement | null>(null);
    let sizer = $state<HTMLSpanElement | null>(null);
    let errors = $state(props.errors ?? form.errors[field ?? id]);

    $effect(() => {
        if (!width_dynamic || !sizer) return;

        // eslint-disable-next-line svelte/no-dom-manipulating
        sizer.textContent = value?.toString() || '';
        sizer.style.fontSize = getComputedStyle(input as Element).fontSize;
        const padding = 20;
        inputWidth = `${Math.max(sizer.offsetWidth + padding, 36)}px`;
    });

    /**
     * Update the input value if the value is changed from the outside via prop binding.
     */
    $effect(() => {
        if (initialValue === incomingValue) return;

        form.data[field ?? id] = value = initialValue = incomingValue;
    });

    $effect(() => {
        errors = get(expandObject(form.errors), error_path ?? field ?? id);
    });

    onMount(() => {
        errors = props.errors ?? form.errors[field ?? id];
    });

    function onInput(e: Event) {
        const newValue = (e.target as HTMLInputElement).value;
        value = form.data[field ?? id] = newValue;
        form.pristine = false;

        oninput?.(e);
    }

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
</script>

<div class={cn('flex-1', inputWrapperTheme)}>
    {#if label}
        <label for={id} class={inputLabelTheme}>
            <Render props={label} />
        </label>
    {/if}

    {#if width_dynamic}
        <span
            bind:this={sizer}
            class="pointer-events-none invisible absolute whitespace-pre border border-red-500 opacity-30"
            style="font: inherit; padding: 0;"
        ></span>
    {/if}

    <div class="relative flex items-center">
        <input
            {id}
            bind:this={input}
            {...props}
            class={cn(
                commonBorderColor,
                commonBackgroundColor,
                commonBorderRadius,
                sizes[size || defaultSize],
                'peer w-full border shadow-xs outline-hidden ring-inset ring-primary transition-all duration-200 focus:border-primary focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
                inputBaseTheme,
                props.class,
                { 'pl-9': props.icon },
                { 'pr-9': props.trailing_icon || props.loading },
                { 'border-destructive! ring-destructive focus:border-destructive': errors?.length },
                { 'min-w-9 p-0 text-center': width_dynamic }
            )}
            {value}
            oninput={onInput}
            style:width={width_dynamic ? inputWidth : undefined}
        />

        {#if props.icon}
            <Icon
                name={props.icon}
                class={cn('left-2.5', iconDefaultClasses, { [iconErrorClasses]: errors?.length })}
            />
        {/if}

        {#if props.trailing_icon || props.loading}
            <Icon
                name={props.loading ? spinner : props.trailing_icon}
                class={cn('right-2.5', iconDefaultClasses, { [iconErrorClasses]: errors?.length })}
            />
        {/if}
    </div>

    {#if errors?.length}
        <div transition:fade class="flex flex-col transition-all duration-200">
            {#each errors as error, index (index)}
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
