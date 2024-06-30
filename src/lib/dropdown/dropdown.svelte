<script lang="ts">
	import { Content, DropdownMenu, Group, Trigger } from '$lib/components/ui/dropdown-menu';
	import { Render } from '../core';

	interface DropdownProps {
		align?: 'start' | 'center' | 'end';
		trigger: any;
		content: any;
	}

	export let props: DropdownProps;
</script>

<DropdownMenu>
	<Trigger>
		<Render props={props.trigger} />
	</Trigger>

	<Content align={props.align}>
		<Group>
			<Render props={props.content} />
		</Group>
	</Content>
</DropdownMenu>
