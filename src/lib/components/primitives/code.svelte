<script lang="ts">
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { useCommon } from '../common/styles.js';
    import hljs from './highlight.js';
    import 'highlight.js/styles/felipec.min.css';

    interface Props extends ElementProps {
        language: string;
        content: string;
    }

    let element: HTMLPreElement;
    const { language = 'javascript', content, ...props }: Props = $props();
    const commonBorderRadius = useCommon('border_radius.lg');

    $effect(() => {
        const languageClass = `language-${language}`;

        if (!element.classList.contains(languageClass)) element.classList.add(languageClass);

        hljs.highlightElement(element);
    });
</script>

<pre bind:this={element} class={cn(commonBorderRadius, 'overflow-auto bg-slate-900 p-4', props.class)}><code
        class={`language-${language}`}>{content}</code
    ></pre>

<style>
    code[class*='language-'],
    pre[class*='language-'] {
        background: none !important;
    }
</style>
