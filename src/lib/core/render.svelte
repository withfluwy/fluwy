<script lang="ts">
    import type { Any, Context } from './contracts.js';
    import { app } from '$lib/index.js';
    import { setupContext, useContext } from './context/index.js';
    import Render from './render.svelte';
    import {
        normalizeToComponents,
        type ComponentSchema,
    } from '@/lib/core/utils/normalizers/normalize-to-components.js';
    import { utils } from '@/lib/core/index.js';

    interface RenderProps {
        props: Any;
        skip?: string[];
        context?: Context;
    }

    let { props, skip = [], context }: RenderProps = $props();

    if (context) setupContext(context);

    context ??= useContext();

    const reservedNames = ['slot', 'content', 'class', 'vars'];
    const components = $derived.by(() => {
        if (utils.isPrimitive(props)) return normalizeToComponents([props]);
        if (utils.isArray(props)) return normalizeToComponents(Object.values(props));
        if (typeof props === 'object' && 'content' in props) return normalizeToComponents(props.content);

        return normalizeToComponents(props);
    });

    function notFound(component: string) {
        const isReserved = reservedNames.includes(component);
        const isSkipped = skip.includes(component);
        const missing = !isReserved && !isSkipped;

        if (missing) {
            console.warn(`[fluwy] Component not found: "${component}". Make sure it is registered.`);
        }

        return missing;
    }

    /**
     * Normalizes string and array templates to objects with `content` attribute.
     */
    function normalizeTemplate(component: ComponentSchema) {
        const template = component.template;

        if (utils.isPrimitive(template)) return { content: template };
        if (utils.isArray(template)) return { content: template };

        return template;
    }
</script>

{#each components as component, index (index)}
    {#if app.hasComponent(component.name)}
        {@const Component = app.getComponent(component.name)}
        <Component {...normalizeTemplate(component)} />
    {:else if component.name === 'slot'}
        <Render props={component.template} />
    {:else if notFound(component.name)}
        <div class="border border-red-500 bg-red-50 p-3 text-red-900">
            Component not found: <b>{component.name}</b>
        </div>
    {:else}
        <span class="font-bold text-red-500">UNKNOWN</span>
    {/if}
{/each}
