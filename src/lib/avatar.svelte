<script lang="ts">
    import * as Avatar from '$lib/ui/avatar/index.js';

    export let props: AvatarProps;

    interface AvatarProps {
        class?: string;
        url: string;
        alt?: string;
        name?: string;
    }

    let fallback = '';

    $: {
        const initials =
            props.name
                ?.split(' ')
                .map((name) => name[0]?.toUpperCase())
                .join('') ?? [];

        fallback = initials[0] + initials[initials.length - 1];
    }
</script>

<Avatar.Root class={props.class}>
    <Avatar.Image src={props.url} alt={props.name} class="object-cover" />

    {#if props.name}
        <Avatar.Fallback>{fallback}</Avatar.Fallback>
    {/if}
</Avatar.Root>
