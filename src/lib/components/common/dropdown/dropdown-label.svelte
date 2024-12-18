<script lang="ts">
    import { Render } from '$lib/core/index.js';
    import { useTheme } from '@/lib/core/utils/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { DropdownMenu } from 'bits-ui';
    import { Dropdown } from './styles.js';

    const props = $props();
</script>

<DropdownMenu.Label class={cn(Dropdown.Label, useTheme('common.dropdown.label'), props?.class)}>
    <Render {props} />
</DropdownMenu.Label>
