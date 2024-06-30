<script lang="ts">
	import { DropdownMenuLabel } from '$lib/components/ui/dropdown-menu/index.js';
	import { Render } from '../core';

	export let props;
</script>

<DropdownMenuLabel>
	<Render {props} />
</DropdownMenuLabel>
