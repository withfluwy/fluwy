<script lang="ts">
    import { Render } from '../core/index.js';
    import { DropdownMenuSub, SubContent, SubTrigger } from '../ui/dropdown-menu/index.js';

    export let props: DropdownSubProps;

    interface DropdownSubProps {
        trigger: unknown;
        content: unknown;
    }
</script>

<DropdownMenuSub>
    <SubTrigger>
        <Render props={props.trigger} />
    </SubTrigger>
    <SubContent>
        <Render props={props.content} />
    </SubContent>
</DropdownMenuSub>
