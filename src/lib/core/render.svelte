<script lang="ts">
    import type { Any, Component, Context } from './contracts.js';
    import { app } from '$lib/index.js';
    import { compile } from './utils/compile/index.js';
    import { setupContext, useContext } from './context/index.js';
    import Render from './render.svelte';
    import Expression from '@/lib/core/expressions/expression.svelte';

    interface RenderProps {
        props: Any;
        component?: {
            name: string;
        };
        skip?: string[];
        only?: string[];
        context?: Context;
    }

    let { props, skip = [], only = [], context }: RenderProps = $props();

    if (context) setupContext(context);

    context ??= useContext();

    const reservedNames = ['slot', 'content', 'component', 'class', 'vars'];

    function parse(rawComponent: { [key: string]: Any }): Component {
        const component = {} as Component;
        component.name = componentName(rawComponent);

        component.value = app.getComponent(component.name);
        component.schema = parseTemplate(rawComponent[component.name]);

        return component;
    }

    function exists(component: Any) {
        if (typeof component === 'string') return app.hasComponent(component);

        const parsed = parse(component);
        return app.hasComponent(parsed.name);
    }

    function componentName(component: Any): Component['name'] {
        return Object.keys(component)[0];
    }

    function notFound(component: string) {
        const isReserved = reservedNames.includes(component);
        const isSkipped = skip.includes(component);

        return !isReserved && !isSkipped;
    }

    const propsValidEntries = $derived(
        Object.entries(props ?? {}).filter(([key]) => {
            if (only.length) return only.includes(key);

            return !skip.includes(key);
        })
    );

    function text(value: Any): string {
        return compile(String(value), context!.data);
    }

    function parseTemplate(template: Any) {
        if (typeof template === 'string') return { content: template };
        if (Array.isArray(template)) return { content: template };

        return template;
    }

    function isArray() {
        const array = Boolean(Array.isArray(props) || props['0']);

        return array && typeof props !== 'string';
    }

    function isExpression(expression: Any) {
        if (typeof expression !== 'string') return false;

        return expression.startsWith('if ');
    }
</script>

{#if props === undefined || props === null}
    <!-- empty -->
{:else if isArray()}
    {#each props as component}
        {#if exists(component)}
            {@const Component = parse(component).value}
            <Component component={parse(component)} {...parse(component).schema} />
        {:else if typeof component === 'string'}
            {text(component)}
        {:else if 'slot' in (component ?? {})}
            <Render props={component.slot} component={{ name: 'slot' }} />
        {:else}
            <div class="border border-red-500 bg-red-50 p-3 text-red-900">
                Component not found: <b>{parse(component).name}</b>
            </div>
        {/if}
    {/each}
{:else if ['string', 'number', 'boolean'].includes(typeof props)}
    {text(props)}
{:else if 'content' in (props ?? {})}
    <Render props={props.content} />
{:else if 'if' in (props ?? {})}
    {@const Component = app.getComponent('if')}
    <Component component={{ name: 'if' }} {...props} />
{:else}
    {#each propsValidEntries as [component, template]}
        {#if component === 'slot'}
            <Render props={template} component={{ name: 'slot' }} />
        {:else if exists(component)}
            {@const Component = app.getComponent(component)}
            <Component component={{ name: component }} {...parseTemplate(template)} />
        {:else if isExpression(component)}
            <Expression value={component} {template} />
        {:else if notFound(component)}
            <div class="border border-red-500 bg-red-50 p-3 text-red-900">
                Component not found: <b>{component}</b>
            </div>
        {:else if reservedNames.includes(component)}
            <!-- reserved -->
        {:else}
            UNKNOWN
        {/if}
    {/each}
{/if}
