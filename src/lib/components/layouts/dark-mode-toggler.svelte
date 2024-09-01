<script lang="ts">
    import { userPrefersMode } from 'mode-watcher';
    import { Dropdown } from '@/lib/components/common/index.js';

    const isMode = (current: 'light' | 'dark' | 'system') => {
        return $userPrefersMode === current;
    };

    const getIconForSelectedMode = $derived(() => {
        switch ($userPrefersMode) {
            case 'light':
                return 'solar:sun-2-linear';
            case 'dark':
                return 'solar:moon-stars-bold';
            case 'system':
                return 'material-symbols:brightness-auto-rounded';
        }
    });
</script>

<Dropdown
    trigger={{
        button: {
            class: 'size-8',
            variant: 'ghost',
            color: 'gray',
            icon_left: {
                name: getIconForSelectedMode(),
                size: 24,
            },
        },
    }}
    content={[
        {
            dropdown_item: {
                icon: 'solar:sun-2-linear',
                text: 'Light',
                class: `${isMode('light') ? 'text-primary' : ''}`,
                on_click: {
                    set_mode: 'light',
                },
            },
        },
        {
            dropdown_item: {
                icon: 'solar:moon-stars-bold',
                class: `${isMode('dark') ? 'text-primary' : ''}`,
                text: 'Dark',
                on_click: {
                    set_mode: 'dark',
                },
            },
        },
        {
            dropdown_item: {
                icon: 'material-symbols:brightness-auto-rounded',
                class: `${isMode('system') ? 'text-primary' : ''}`,
                text: 'System',
                on_click: {
                    set_mode: 'system',
                },
            },
        },
    ]}
/>
