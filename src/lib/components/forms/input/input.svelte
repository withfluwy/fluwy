<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import type { InputProps } from '../contracts.js';
    import { cn, Random } from '@/lib/core/utils/index.js';
    import { Icon } from '@/lib/components/common/index.js';
    import { mergeThemes, useTheme } from '@/lib/core/client/index.js';
    import { Common, useCommon } from '@/lib/components/common/styles.js';
    import { Render } from '@/lib/core/index.js';
    import { DefaultSize, Sizes } from '../styles.js';

    let { value, errors, oninput, label, size, description, width_dynamic, ...props }: InputProps = $props();

    const id = Random.id();
    const spinner = useTheme('common.spinner', Common.spinner);
    const commonBorderColor = useCommon('border_color');
    const commonBackgroundColor = useCommon('background_color');
    const commonBorderRadius = useCommon('border_radius.md');
    const sizes = mergeThemes('forms.common.sizes', Sizes);
    const defaultSize = mergeThemes('forms.common.default_size', DefaultSize);

    let inputWidth = $state('auto');
    let input = $state<HTMLInputElement | null>(null);
    let sizer = $state<HTMLSpanElement | null>(null);

    $effect(() => {
        if (!width_dynamic || !sizer) return;
        
        sizer.textContent = value?.toString() || '';
        sizer.style.fontSize = getComputedStyle(input as Element).fontSize;
        const padding = 20;
        inputWidth = `${Math.max(sizer.offsetWidth + padding, 36)}px`;
    });

    const inputLabelTheme = cn(
        'flex justify-between text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200',
        useTheme('forms.input.label')
    );

    const iconDefaultClasses = 'absolute pointer-events-none peer-disabled:opacity-50 text-neutral-400 transition duration-100 peer-focus:text-primary';
    const inputBaseTheme = useTheme('forms.input.base');
    const inputWrapperTheme = useTheme('forms.input.wrapper');

    const inputDescriptionTheme = cn(
        'text-sm flex justify-between mt-1 text-neutral-500 dark:text-neutral-400',
        useTheme('forms.input.description')
    );
    const inputErrorsTheme = cn('text-sm text-destructive placeholder:text-red-500', useTheme('forms.input.errors'));
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
            class="whitespace-pre border invisible absolute pointer-events-none border-red-500 opacity-30"
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
                'peer w-full border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none ring-inset ring-primary transition-all duration-200 focus:border-primary focus:ring-1',
                inputBaseTheme,
                props.class,
                { 'pl-9': props.icon },
                { 'pr-9': props.trailing_icon || props.loading },
                { '!border-destructive ring-destructive focus:border-destructive': errors?.length },
                { 'min-w-9 p-0 text-center': width_dynamic }
            )}
            bind:value
            {oninput}
            style:width={width_dynamic ? inputWidth : undefined}
        />

        {#if props.icon}
            <Icon name={props.icon} class={`left-2.5 ${iconDefaultClasses}`} />
        {/if}

        {#if props.trailing_icon || props.loading}
            <Icon name={props.loading ? spinner : props.trailing_icon} class={`right-2.5 ${iconDefaultClasses}`} />
        {/if}
    </div>

    {#if errors?.length}
        <div transition:fade class="mt-0.5 flex flex-col">
            {#each errors as error}
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
