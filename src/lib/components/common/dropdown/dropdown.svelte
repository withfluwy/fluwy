<script lang="ts">
    import { DropdownMenu } from 'bits-ui';
    import { Render } from '@/lib/core/index.js';
    import { cn, flyAndScale } from '@/lib/core/utils/index.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { Dropdown } from './styles.js';

    interface DropdownProps {
        align?: 'start' | 'center' | 'end';
        trigger: any;
        content: any;
    }

    const dropdownContent = $derived(cn(Dropdown.Content, useTheme('common.dropdown.content')));
    const props: DropdownProps = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <div role="button" use:builder.action {...builder}>
            <Render props={props.trigger} />
        </div>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content align={props.align} class={dropdownContent} transition={flyAndScale} sideOffset={2}>
        <DropdownMenu.Group>
            <Render props={props.content} />
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
