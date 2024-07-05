<script lang="ts">
	// import type { ElementProps } from './core';
	import type { Any } from './core/contracts.js';
	import { cn, deferred } from './core/utils/index.js';
	import { Icon, type IconProps } from './icon/index.js';
	import { useClient, useTheme } from './core/client/index.js';
	import { useContext } from './core/context/index.js';
	import { createEventDispatcher } from 'svelte';
	import type { ElementProps } from './core/index.js';
	import { mergeTheme } from './core/utils/merge-theme/index.js';

	type Color = 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'gray';
	type Shape = 'filled' | 'outline' | 'ghost' | 'link';

	interface ButtonProps extends Omit<ElementProps, 'content'> {
		text?: string;
		icon_left?: IconProps | string;
		icon_right?: IconProps | string;
		loading?: boolean;
		disabled?: boolean;
		class?: string;
		shape?: Shape;
		color?: Color;
		on_click?: Any;
	}

	export let props: ButtonProps | string;
	export let component: { name: string };

	const buttonTheme = useTheme(component.name);

	const dispatch = createEventDispatcher();

	let innerLoading = false;

	$: propObject = typeof props === 'string' ? ({ text: props } as ButtonProps) : ((props ?? {}) as ButtonProps);
	$: shape = propObject.shape || 'filled';
	$: color = propObject.color || 'default';
	$: loading = propObject.loading || innerLoading;
	$: disabled = propObject.disabled || loading;

	const Colors: Record<Shape, Record<Color, string>> = mergeTheme(
		{
			filled: {
				default: 'bg-white border text-gray enabled:hover:bg-gray-100',
				primary: 'bg-primary text-primary-contrast enabled:hover:bg-primary/90',
				danger: 'bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90',
				success: 'bg-green-500 text-white enabled:hover:bg-green-500/90',
				warning: 'bg-yellow-500 text-white enabled:hover:bg-yellow-500/90',
				info: 'bg-blue-400 text-white enabled:hover:bg-blue-400/90',
				gray: 'bg-gray-400 text-white enabled:hover:bg-gray-400/90',
			},
			outline: {
				default: 'bg-transparent border border-black text-black enabled:hover:bg-black/5',
				primary: 'bg-transparent border border-primary text-primary enabled:hover:bg-primary/10',
				danger: 'bg-transparent border border-destructive text-destructive enabled:hover:bg-destructive/10',
				success: 'bg-transparent border border-green-500 text-green-500 enabled:hover:bg-green-500/10',
				warning: 'bg-transparent border border-yellow-500 text-yellow-500 enabled:hover:bg-yellow-500/10',
				info: 'bg-transparent border border-blue-400 text-blue-400 enabled:hover:bg-blue-400/10',
				gray: 'bg-transparent border border-gray-400 text-gray-500 enabled:hover:bg-gray-400/10',
			},
			ghost: {
				default: 'bg-transparent border border-transparent text-black shadow-none enabled:hover:bg-gray-50',
				primary:
					'bg-transparent border border-transparent text-primary shadow-none enabled:hover:bg-primary-50',
				danger: 'bg-transparent border border-transparent text-destructive shadow-none enabled:hover:bg-destructive/5',
				success:
					'bg-transparent border border-transparent text-green-500 shadow-none enabled:hover:bg-green-50',
				warning:
					'bg-transparent border border-transparent text-yellow-500 shadow-none enabled:hover:bg-yellow-50',
				info: 'bg-transparent border border-transparent text-blue-400 shadow-none enabled:hover:bg-blue-50',
				gray: 'bg-transparent border border-transparent text-gray-500 shadow-none enabled:hover:bg-gray-50',
			},
			link: {
				default: 'bg-transparent border-none text-black shadow-none enabled:hover:underline',
				primary: 'bg-transparent border-none text-primary shadow-none enabled:hover:underline',
				danger: 'bg-transparent border-none text-destructive shadow-none enabled:hover:underline',
				success: 'bg-transparent border-none text-green-500 shadow-none enabled:hover:underline',
				warning: 'bg-transparent border-none text-yellow-500 shadow-none enabled:hover:underline',
				info: 'bg-transparent border-none text-blue-400 shadow-none enabled:hover:underline',
				gray: 'bg-transparent border-none text-gray-500 shadow-none enabled:hover:underline',
			},
		},
		buttonTheme
	);

	const context = useContext();
	const client = useClient();

	async function handleClick(e: MouseEvent) {
		if (!propObject.on_click) {
			return dispatch('click');
		}

		e.stopPropagation();

		let done = false;

		deferred(() => (innerLoading = !done));

		try {
			return await client.handleOperations(propObject.on_click, context);
		} catch (error) {
			console.error(error);
		} finally {
			innerLoading = false;
			done = true;
		}
	}
</script>

<button
	on:click={handleClick}
	class={cn(
		`flex h-9 items-center justify-center gap-1 rounded-lg px-2 py-1 shadow-sm transition-all duration-75 enabled:active:scale-[0.99]`,
		Colors[shape][color],
		propObject.class,
		disabled ? 'hover:none cursor-not-allowed opacity-50' : ''
	)}
	{disabled}
>
	{#if propObject.icon_left && !loading}
		<Icon props={propObject.icon_left} />
	{:else if loading}
		<Icon props={{ name: 'svg-spinners:90-ring-with-bg' }} />
	{/if}

	{#if propObject.text}
		<span>{propObject.text}</span>
	{/if}

	{#if propObject.icon_right}
		<Icon props={propObject.icon_right} />
	{/if}
</button>
