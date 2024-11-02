<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { marked, type Tokens } from 'marked';
    import dom from 'dompurify';
    import { browser } from '$app/environment';
    import { cn, str } from '@/lib/core/utils/index.js';
    import { Typography, Blocks } from './styles.js';
    import { useTheme } from '@/lib/core/client/index.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { useCommon } from '../common/styles.js';
    import hljs from 'highlight.js';

    interface Props extends ElementProps {
        generate_ids?: boolean;
    }

    const { content, generate_ids = true, ...props }: Props = $props();
    const classes = {
        h1: cn(Typography.h1, useTheme('typography.h1')),
        h2: cn(Typography.h2, useTheme('typography.h2')),
        h3: cn(Typography.h3, useTheme('typography.h3')),
        h4: cn(Typography.h4, useTheme('typography.h4')),
        h5: cn(Typography.h5, useTheme('typography.h5')),
        h6: cn(Typography.h6, useTheme('typography.h6')),
        p: cn(Typography.p, useTheme('typography.p')),
        ol: cn(Typography.ol, useTheme('typography.ol')),
        ul: cn(Typography.ul, useTheme('typography.ul')),
        link: cn(Typography.link, useTheme('typography.link')),
        hr: cn(useCommon('border_color'), Typography.hr, useTheme('typography.hr')),
        code: cn(useCommon('border_radius.lg'), useCommon('border_color'), Blocks.code),
        codespan: cn(
            useCommon('border_radius.sm'),
            useCommon('border_color'),
            Typography.codespan,
            useTheme('typography.codespan')
        ),
        blockquote: cn(
            useCommon('border_color'),
            useCommon('border_radius.lg'),
            Blocks.blockquote,
            useTheme('typography.blockquote')
        ),
    };

    marked.use({
        extensions: [
            {
                name: 'heading',
                renderer(token) {
                    const id = generate_ids ? str(token.text).slugCase() : '';
                    const headings: Record<number, string> = {
                        1: `<h1 id="${id}" class="${classes.h1}">${marked.parseInline(token.text)}</h1>`,
                        2: `<h2 id="${id}" class="${classes.h2}">${marked.parseInline(token.text)}</h2>`,
                        3: `<h3 id="${id}" class="${classes.h3}">${marked.parseInline(token.text)}</h3>`,
                        4: `<h4 id="${id}" class="${classes.h4}">${marked.parseInline(token.text)}</h4>`,
                        5: `<h5 id="${id}" class="${classes.h5}">${marked.parseInline(token.text)}</h5>`,
                        6: `<h6 id="${id}" class="${classes.h6}">${marked.parseInline(token.text)}</h6>`,
                    };
                    return headings[token.depth] || token.text;
                },
            },
            {
                name: 'paragraph',
                renderer(token) {
                    return `<p class="${classes.p}">${this.parser.parseInline(token.tokens ?? [])}</p>`;
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
                    return `<${list.ordered ? 'ol' : 'ul'} class="${classes.ol}">${listItems}</${list.ordered ? 'ol' : 'ul'}>`;
                },
            },
            {
                name: 'link',
                renderer(token) {
                    const link = token as Tokens.Link;
                    return `<a href="${link.href}" class="${classes.link}">${link.text}</a>`;
                },
            },
            {
                name: 'hr',
                renderer() {
                    return `<hr class="${classes.hr}">`;
                },
            },
            {
                name: 'code',
                renderer(token) {
                    const code = hljs.highlight(token.text, { language: token.lang || 'plaintext' }).value;

                    return `<pre class="${classes.code}"><code style="background: none;" class="language-${token.lang}">${code}</code></pre>`;
                },
            },
            {
                name: 'codespan',
                renderer(token) {
                    return `<code class="${classes.codespan}">${token.text}</code>`;
                },
            },
            {
                name: 'blockquote',
                renderer(token) {
                    return `<blockquote class="${classes.blockquote}">${marked.parseInline(token.text)}</blockquote>`;
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
        /**
         * Workaround for the issue that the table-of-contents component is not rendered yet
         * when the markdown component is rendered.
         *
         * @FIXME: Find a better solution.
         */
        setTimeout(() => Events.emit(Events.markdownReady), 10);
        return dom.sanitize(marked(content) as string);
    });
</script>

<div id={props.id} class={cn('content', props.class)}>
    {#await html}
        <!-- empty -->
    {:then $html}
        {@html $html}
    {:catch error}
        {error}
    {/await}
</div>
