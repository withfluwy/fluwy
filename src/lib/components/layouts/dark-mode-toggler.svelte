<script lang="ts">
    import { userPrefersMode } from 'mode-watcher';
    import { Dropdown } from '@/lib/components/common/index.js';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn } from '@/lib/core/utils/index.js';

    interface Props extends ElementProps {
        color?: string;
    }

    const isMode = (current: 'light' | 'dark' | 'system') => {
        return $userPrefersMode === current;
    };

    const getIconForSelectedMode = $derived(() => {
        switch ($userPrefersMode) {
            case 'light':
                return 'ph:sun';
            case 'dark':
                return 'ph:moon';
            case 'system':
                return 'material-symbols:contrast';
        }
    });

    const { color, ...props }: Props = $props();
</script>

<Dropdown
    trigger={{
        button: {
            class: cn('size-8 opacity-75 hover:opacity-100', props.class),
            variant: 'ghost',
            color,
            icon: {
                name: getIconForSelectedMode(),
                size: 24,
            },
        },
    }}
    content={[
        {
            dropdown_item: {
                icon: 'ph:sun',
                text: 'Light',
                class: `${isMode('light') ? 'text-primary' : ''}`,
                on_click: {
                    set_mode: 'light',
                },
            },
        },
        {
            dropdown_item: {
                icon: 'ph:moon',
                class: `${isMode('dark') ? 'text-primary' : ''}`,
                text: 'Dark',
                on_click: {
                    set_mode: 'dark',
                },
            },
        },
        {
            dropdown_item: {
                icon: 'material-symbols:contrast',
                class: `${isMode('system') ? 'text-primary' : ''}`,
                text: 'System',
                on_click: {
                    set_mode: 'system',
                },
            },
        },
    ]}
/>
