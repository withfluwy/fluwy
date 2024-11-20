<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { Random, cn } from '../core/utils/index.js';
    import { Icon } from '../components/common/icon/index.js';
    import type { InputProps } from './types.js';

    let { value, errors, oninput, ...props }: InputProps = $props();
    const id = Random.id();

    const iconDefaultClasses = 'absolute text-neutral-300 transition duration-100 peer-focus:text-primary';
</script>

<div>
    {#if props.label}
        <label for={id} class="flex flex-col gap-1">
            <div class="text-sm font-medium leading-6 text-neutral-700">{props.label}</div>
        </label>
    {/if}

    <div class="relative flex items-center">
        <input
            {id}
            {...props}
            class={cn(
                'peer h-9 w-full rounded-lg border px-3 shadow-sm outline-none ring-inset ring-primary transition-all duration-200 focus:border-primary focus:ring-1',
                props.class,
                props.icon ? 'pl-8' : '',
                props.trailing_icon ? 'pr-8' : '',
                errors?.length ? 'border-destructive ring-destructive focus:border-destructive' : ''
            )}
            bind:value
            {oninput}
            style:width={props.width_dynamic ? `${value.toString().length + 1}ch` : undefined}
        />

        {#if props.icon}
            <Icon name={props.icon} class={`left-2 ${iconDefaultClasses}`} />
        {/if}

        {#if props.trailing_icon}
            <Icon name={props.trailing_icon} class={`right-2 ${iconDefaultClasses}`} />
        {/if}
    </div>

    {#if errors?.length}
        <div transition:fade class="mt-0.5 flex flex-col gap-1">
            {#each errors as error}
                <div transition:slide|global={{ duration: 150 }} class="text-xs text-destructive">
                    {error}
                </div>
            {/each}
        </div>
    {/if}
</div>
