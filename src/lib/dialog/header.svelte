<script lang="ts">
    import { Dialog } from 'bits-ui';
    import Button from '../components/forms/button/button.svelte';
    import { cn } from '../core/utils/index.js';

    export let props: HeaderProps = {};
    interface HeaderProps {
        class?: string;
    }
</script>

<div
    class={cn(
        'sticky inset-x-0 top-0 z-10 flex items-center border-b bg-white/90 px-5 pt-4 backdrop-blur-xs',
        props.class
    )}
>
    <div class="mb-4">
        <slot />
    </div>

    <Dialog.Close
        class="active:scale-98 focus-visible:ring-foreground focus-visible:ring-offset-background absolute right-3.5 top-3.5 z-10 rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <Button
            {...{
                icon: 'ph:x',
                shape: 'ghost',
                class: 'opacity-50 hover:opacity-100',
                on_click: 'close_dialog',
            }}
        />
        <span class="sr-only">Close</span>
    </Dialog.Close>
</div>
