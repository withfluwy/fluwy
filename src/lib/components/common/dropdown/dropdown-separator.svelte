<script lang="ts">
    import { useTheme } from '@/lib/core/client/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { DropdownMenu } from 'bits-ui';
    import { Dropdown } from './styles.js';

    const props = $props();
</script>

<DropdownMenu.Separator class={cn(useTheme('common.dropdown.separator', Dropdown.Separator), props?.class)} />
