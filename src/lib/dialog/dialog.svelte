<script lang="ts">
    import { Dialog as PrimitiveDialog } from 'bits-ui';
    import * as Dialog from './index.js';
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { DialogEvents, useDialogs } from '../core/stores/dialogs.js';
    import type { Any, Context } from '../core/contracts.js';
    import { Render } from '../core/index.js';
    import { cn, deferred, flyAndScale } from '../core/utils/index.js';
    import { Icon } from '../components/common/icon/index.js';
    import { useContext } from '../core/context/index.js';
    import { useClient } from '../core/client/index.js';
    import { Durations, Operation } from '../core/constants.js';
    import { Events } from '../core/utils/events/index.js';

    export let props: DialogProps;

    interface DialogProps {
        id: string;
        header?: Any;
        description?: Any;
        content?: Any;
        load?: Record<string, Any>;
        footer?: Any;
        class?: string;
    }

    let open = false;
    let loading = false;
    const dialogs = useDialogs();
    const transitionDuration = Durations.transition;
    const context = useContext();
    const client = useClient();

    onMount(async () => {
        open = true;

        Events.on(DialogEvents.CLOSE, onCloseEvent);

        await resolveLoaders(props.load || {}, context);
    });

    onDestroy(() => {
        Events.removeListener(DialogEvents.CLOSE, onCloseEvent);
    });

    async function resolveLoaders(loadParams: Record<string, Any>, context: Context) {
        if (!Object.keys(loadParams).length) return;

        type LoadOption = {
            if?: Any;
            get?: string;
            post?: string;
        };

        loading = true;

        for (let [varName, operations] of Object.entries(loadParams)) {
            operations = operations as LoadOption;

            try {
                const varValue = await client.handleOperations(operations, context);
                context.set(varName, varValue);
            } catch (rejection) {
                if (rejection === Operation.Cancelled) continue;
                throw rejection;
            }
        }

        loading = false;
    }

    function onCloseEvent(id: string) {
        if (id !== props.id) return;

        onOpenChange((open = false));
    }

    function onOpenChange(isOpen: boolean) {
        if (isOpen) return;

        deferred(() => dialogs.remove(props.id));
    }
</script>

<PrimitiveDialog.Root bind:open {onOpenChange}>
    <PrimitiveDialog.Portal class="fixed inset-0 flex items-center justify-center py-10">
        <PrimitiveDialog.Overlay
            transition={fade}
            transitionConfig={{ duration: transitionDuration }}
            class="fixed inset-0 z-50 bg-black/20 backdrop-blur-md"
        />

        <PrimitiveDialog.Content transition={flyAndScale} class="fixed z-50 mx-8 overflow-hidden">
            <div class={cn('relative w-[400px]', props.class, `overflow-hidden rounded-2xl`)}>
                <div class="flex max-h-[calc(100vh-8rem)] min-h-[200px] flex-col">
                    {#if loading}
                        <div
                            transition:fade
                            class="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm"
                        >
                            <Icon name="svg-spinners:90-ring-with-bg" size={40} class="text-neutral-500" />
                        </div>
                    {:else}
                        <div class="overflow-auto bg-white">
                            {#if props.header || props.description}
                                <Dialog.Header>
                                    {#if props.header}
                                        <PrimitiveDialog.Title
                                            class="flex w-full items-center pr-8 text-lg font-semibold tracking-tight"
                                        >
                                            <Render props={props.header} />
                                        </PrimitiveDialog.Title>
                                    {/if}
                                    {#if props.description}
                                        <PrimitiveDialog.Description class="text-muted-foreground text-xs">
                                            <Render props={props.description} />
                                        </PrimitiveDialog.Description>
                                    {/if}
                                </Dialog.Header>
                            {/if}
                            {#if props.content}
                                <div class={cn('flex flex-col gap-3 p-5', props.content.class)}>
                                    <Render props={props.content} />
                                </div>
                            {/if}
                        </div>

                        {#if props.footer}
                            <div
                                class={cn(
                                    'flex w-full justify-end gap-3 border-t bg-neutral-50 p-5',
                                    props.footer.class
                                )}
                            >
                                <Render props={props.footer} />
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </PrimitiveDialog.Content>
    </PrimitiveDialog.Portal>
</PrimitiveDialog.Root>
