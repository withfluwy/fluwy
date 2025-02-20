<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn, str } from '@/lib/core/utils/index.js';
    import { Avatar } from 'bits-ui';
    import { useCommon } from '../styles.js';
    import { AvatarStyles } from './styles.js';
    import { mergeThemes } from '@/lib/core/utils/index.js';

    interface Props extends ElementProps {
        src?: string;
        alt?: string;
        name?: string;
        show_initials?: boolean;
        only_first_and_last?: boolean;
        size?: 'sm' | 'md' | 'lg';
    }

    const { show_initials = true, size = 'md', only_first_and_last = true, alt, name, ...props }: Props = $props();
    const src = $derived(props.src ?? props.content);
    const avatarSizes = mergeThemes('common.avatar.sizes', AvatarStyles.Sizes);
    const avatarSize = $derived(avatarSizes[size]);
    const initialsSize = $derived(AvatarStyles.InitialsSizes[size]);
    const initials = $derived(name ? str(name).initials({ onlyFirstAndLast: only_first_and_last }) : undefined);
    const commonBorderColor = useCommon('border_color');
    const commonForegroundColor = useCommon('foreground_color');
</script>

<Avatar.Root
    class={cn(commonBorderColor, avatarSize, initialsSize, 'shrink-0 rounded-full uppercase', props.class)}
>
    <div
        class={cn(
            commonBorderColor,
            commonForegroundColor,
            'flex h-full w-full items-center justify-center overflow-hidden rounded-full border'
        )}
    >
        <Avatar.Image {src} alt={alt ?? name} />
        {#if show_initials && initials}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
        {/if}
    </div>
</Avatar.Root>
