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

    interface DateProps extends ElementProps {
        /**
         * The format to use for the date compatible with `dayjs`
         */
        format?: string;
    }

    const { format, ...props }: DateProps = $props();

    const context = useContext();
    const value = $derived(compile(typeof props === 'string' ? props : props.content, context.data));
    const dateFormat = useTheme('displays.date_format', DisplaySettings.dateFormat);
    const formattedDate = $derived(formatDate(value, format ?? dateFormat));
</script>

<span class={cn(props.class)}>{formattedDate}</span>
