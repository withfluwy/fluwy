<script lang="ts">
    import type { Any, Component, Context } from './contracts.js';
    import { app } from '$lib/index.js';
    import { setContext } from 'svelte';
    import { compile } from './utils/compile/index.js';
    import { useContext } from './context/index.js';

    export let props: Any;
    export let skip: string[] = [];
    export let only: string[] = [];
    export let context: Context | undefined = undefined;

    if (context) setContext('context', context);

    context ??= useContext();

    const reservedNames = ['slot', 'content', 'class', 'vars'];

    function parse(rawComponent: { [key: string]: any }): Component {
        const component = {} as Component;
        component.name = componentName(rawComponent);

        component.value = app.getComponent(component.name);
        component.schema = parseSchema(rawComponent[component.name]);

        return component;
    }

    function exists(component: any) {
        if (typeof component === 'string') return app.hasComponent(component);

        const parsed = parse(component);
        return app.hasComponent(parsed.name);
    }

    function componentName(component: any): Component['name'] {
        return Object.keys(component)[0];
    }

    function notFound(component: string) {
        const isReserved = reservedNames.includes(component);
        const isSkipped = skip.includes(component);

        return !isReserved && !isSkipped;
    }

    $: propsValidEntries = Object.entries(props ?? {}).filter(([key]) => {
        if (only.length) return only.includes(key);

        return !skip.includes(key);
    });

    function text(value: Any): string {
        return compile(String(value), context!.data);
    }

    function parseSchema(schema: Any) {
        if (typeof schema === 'string') return { content: schema };

        return schema;
    }
    function isArray() {
        const array = Boolean(Array.isArray(props) || props['0']);

        return array && typeof props !== 'string';
    }
</script>

{#if props === undefined || props === null}
    <!-- empty -->
{:else if isArray()}
    {#each props as component}
        {#if exists(component)}
            <svelte:component this={parse(component).value} component={parse(component)} {...parse(component).schema} />
        {:else if typeof component === 'string'}
            {text(component)}
        {:else}
            <div class="border border-red-500 bg-red-50 p-3 text-red-900">
                Component not found: <b>{parse(component).name}</b>
            </div>
        {/if}
    {/each}
{:else if ['string', 'number', 'boolean'].includes(typeof props)}
    {text(props)}
{:else if 'content' in (props ?? {})}
    <svelte:self props={props.content} />
{:else if 'if' in (props ?? {})}
    <svelte:component this={app.getComponent('if')} component={{ name: 'if' }} {...props} />
{:else}
    {#each propsValidEntries as [component, schema]}
        {#if component === 'slot'}
            <svelte:self props={schema} component={{ name: 'slot' }} />
        {:else if exists(component)}
            <svelte:component
                this={app.getComponent(component)}
                component={{ name: component }}
                {...parseSchema(schema)}
            />
        {:else if notFound(component)}
            <div class="border border-red-500 bg-red-50 p-3 text-red-900">
                Component not found: <b>{component}</b>
            </div>
        {:else}
            UNKNOWN
        {/if}
    {/each}
{/if}
