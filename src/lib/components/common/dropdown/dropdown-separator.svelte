<script lang="ts">
    import { useTheme } from '@/lib/core/utils/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { DropdownMenu } from 'bits-ui';
    import { Dropdown } from './styles.js';

    const props = $props();
</script>

<DropdownMenu.Separator class={cn(Dropdown.Separator, useTheme('common.dropdown.separator'), props?.class)} />
