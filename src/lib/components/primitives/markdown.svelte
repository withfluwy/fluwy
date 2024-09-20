<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { marked } from 'marked';
    import dom from 'dompurify';
    import { browser } from '$app/environment';
    import { cn } from '@/lib/core/utils/index.js';
    import { Typography } from './styles.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import type { Tokens } from 'marked';

    interface Props extends ElementProps {}

    const { content, ...props }: Props = $props();
    marked.use({
        extensions: [
            {
                name: 'heading',
                renderer(token) {
                    const headings: Record<number, string> = {
                        1: `<h1 class="${cn(Typography.h1, useTheme('typography.h1'))}">${token.text}</h1>`,
                        2: `<h2 class="${cn(Typography.h2, useTheme('typography.h2'))}">${token.text}</h2>`,
                        3: `<h3 class="${cn(Typography.h3, useTheme('typography.h3'))}">${token.text}</h3>`,
                        4: `<h4 class="${cn(Typography.h4, useTheme('typography.h4'))}">${token.text}</h4>`,
                        5: `<h5 class="${cn(Typography.h5, useTheme('typography.h5'))}">${token.text}</h5>`,
                        6: `<h6 class="${cn(Typography.h6, useTheme('typography.h6'))}">${token.text}</h6>`,
                    };
                    return headings[token.depth] || token.text;
                },
            },
            {
                name: 'paragraph',
                renderer(token) {
                    return `<p class="${cn(Typography.p, useTheme('typography.p'))}">${this.parser.parseInline(token.tokens ?? [])}</p>`;
                },
            },
            {
                name: 'list',
                renderer(token) {
                    const list = token as Tokens.List;
                    const listItems = list.items
                        .map((item) => `<li>${this.parser.parseInline(item.tokens)}</li>`)
                        .join('');
                    const style = list.ordered ? Typography.ol : Typography.ul;
                    return `<${list.ordered ? 'ol' : 'ul'} class="${cn(style, useTheme('typography.p'))}">${listItems}</${list.ordered ? 'ol' : 'ul'}>`;
                },
            },
            {
                name: 'link',
                renderer(token) {
                    const link = token as Tokens.Link;
                    return `<a href="${link.href}" class="${cn(Typography.link, useTheme('typography.link'))}">${link.text}</a>`;
                },
            },
        ],
    });

    const html = $derived.by(async () => {
        if (!browser) {
            const JSDOM = (await import('jsdom')).JSDOM;
            const window = new JSDOM('').window;
            const purify = dom(window);

            return purify.sanitize(marked(content) as string);
        }

        return dom.sanitize(marked(content) as string);
    });
</script>

<div class={cn('content', props.class)}>
    {#await html}
        <!-- empty -->
    {:then $html}
        {@html $html}
    {:catch error}
        {error}
    {/await}
</div>
