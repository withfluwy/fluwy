<script lang="ts">
    import localizedFormat from 'dayjs/plugin/localizedFormat.js';
    import dayjs from 'dayjs';
    import { cn } from '@/lib/core/utils/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { formatDate } from './utils.js';
    import { DisplaySettings } from './settings.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { compile, useContext } from '@/lib/core/index.js';

    dayjs.extend(localizedFormat);

    interface DatetimeProps extends ElementProps {
        /**
         * The format to use for the datetime compatible with `dayjs`
         */
        format?: string;
    }

    const { format, ...props }: DatetimeProps = $props();

    const context = useContext();
    const value = $derived(compile(typeof props === 'string' ? props : props.content, context.data));
    const datetimeFormat = useTheme('displays.datetime_format', DisplaySettings.datetimeFormat);
    const formattedDatetime = $derived(formatDate(value, format ?? datetimeFormat));
</script>

<span class={cn(props.class)}>{formattedDatetime}</span>
