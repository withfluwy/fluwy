<script lang="ts">
	import { cn } from './core/utils';
	import { Input } from './form';

	export let props: SearchProps;

	interface SearchProps {
		icon?: string;
		url?: string;
		class?: string;
	}

	$: icon = props.icon || 'solar:magnifer-linear';
</script>

<Input
	props={{
		placeholder: 'Search...',
		icon_left: icon,
		class: cn('w-96', props.class),
	}}
/>
