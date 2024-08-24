<script lang="ts">
    import { DropdownMenu } from 'bits-ui';
    import { Render } from '@/lib/core/index.js';
    import { flyAndScale } from '@/lib/core/utils/index.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { Dropdown } from './styles.js';

    interface DropdownProps {
        align?: 'start' | 'center' | 'end';
        trigger: any;
        content: any;
    }

    const dropdownContent = useTheme('common.dropdown.content', Dropdown.Content);

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
