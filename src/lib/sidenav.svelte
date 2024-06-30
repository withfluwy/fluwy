<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from './core/utils';
	import Shortcut from './shortcut.svelte';

	export let props: SidenavProps;

	interface SidenavProps {
		search?: string | Search;
		menu: MenuItem[];
		class?: string;
		logo?: {
			height?: number;
			light?: string;
			dark?: string;
		};
	}
	interface MenuItem {
		title: string;
		icon: string | Icon;
		link: string;
		shortcut?: string;
	}
	interface Icon {
		name: string;
		size?: number;
	}
	interface Search {
		url: string;
		placeholder?: string;
		icon?: string | Icon;
	}

	$: isActive = (item: MenuItem) => {
		if (item.link === '/') return $page.url.pathname === '/';

		return $page.url.pathname.startsWith(item.link);
	};

	$: getIcon = (item: { icon: string | Icon }): Icon => {
		return typeof item.icon === 'string' ? { name: item.icon, size: 20 } : item.icon;
	};
</script>

<div class={cn('w-64 h-full p-3 shrink-0 bg-gray-50', props.class)}>
	{#if props.logo}
		<img
			src={props.logo.light}
			alt="logo"
			style:height={props.logo.height ?? '20px'}
			class="px-4 mt-4 mb-6"
		/>
	{/if}

	<nav>
		<ul class="flex flex-col gap-2">
			{#each props.menu as item}
				<a
					href={item.link}
					class={`
                    cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg
                    ${isActive(item) ? 'opacity-100 font-semibold bg-gray-100' : 'opacity-50 hover:opacity-100 hover:bg-gray-100'}
                `}
				>
					<iconify-icon
						class={`
                        ${isActive(item) ? 'opacity-100' : 'opacity-50'}
                    `}
						icon={getIcon(item).name}
						height={getIcon(item).size}
					/>
					<span>{item.title}</span>

					{#if item.shortcut}
						<Shortcut props={item.shortcut} />
					{/if}
				</a>
			{/each}
		</ul>
	</nav>
</div>
