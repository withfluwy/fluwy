<script lang="ts">
    import localizedFormat from 'dayjs/plugin/localizedFormat.js';
    import relativeTime from 'dayjs/plugin/relativeTime.js';
    import dayjs from 'dayjs';
    import { cn } from '@/lib/core/utils/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { formatDate } from './utils.js';
    import { DisplaySettings } from './settings.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { compile, useContext } from '@/lib/core/index.js';

    dayjs.extend(localizedFormat);
    dayjs.extend(relativeTime);
    interface DatetimeProps extends ElementProps {
        /**
         * The format to use for the datetime compatible with `dayjs`
         */
        format?: string;
    }

    const { format, ...props }: DatetimeProps = $props();

    const context = useContext();
    const value = $derived(compile(typeof props === 'string' ? props : props.content, context.data));
    const relativeDatetime = $derived(value ? dayjs(value).fromNow() : '');
</script>

<span class={cn(props.class)}>{relativeDatetime}</span>
