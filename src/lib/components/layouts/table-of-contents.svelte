<script lang="ts">
    import { browser } from '$app/environment';
    import { afterNavigate, goto } from '$app/navigation';
    import type { ElementProps } from '@/lib/core/contracts.js';
    import { Events } from '@/lib/core/utils/events/index.js';
    import { cn } from '@/lib/core/utils/index.js';
    import { onDestroy, onMount } from 'svelte';
    import { useCommon } from '../common/styles.js';

    interface TocItem {
        id: string;
        title: string;
        level: number;
        children: TocItem[];
    }
    interface TableOfContentsProps extends ElementProps {
        selector?: string;
        /**
         * Maximum depth of the table of contents.
         * If not set, all headings will be included.
         */
        max_level?: number;
    }

    const props: TableOfContentsProps = $props();
    const selector = $derived(props.selector || props.content);
    const max_level = $derived(props.max_level);
    const scrollDelay = 750;
    const commonBorderColor = useCommon('border_color');

    let tocData: TocItem[] = $state([]);
    let activeIds: string[] = $state([]);
    let observer: IntersectionObserver;

    Events.on(Events.markdownReady, initialize);
    onMount(initialize);
    onDestroy(() => observer?.disconnect());

    function isActive(id: string): boolean {
        return activeIds.includes(id);
    }

    function initialize() {
        const element = document.querySelector(selector);

        if (!element) {
            tocData = [];
            return;
        }

        const headings = getHeadings(element);

        tocData = buildTocStructure(headings);

        observer?.disconnect();
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.getAttribute('id');
                    if (!id) return;

                    entry.isIntersecting
                        ? activeIds.push(id)
                        : (activeIds = activeIds.filter((activeId) => activeId !== id));
                });
            },
            { threshold: 0.5 }
        );

        headings.forEach((heading) => {
            observer.observe(heading);
        });
    }

    function getHeadings(element: Element): NodeListOf<HTMLHeadingElement> {
        const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const maxLevelSelectors = max_level ? headingSelectors.slice(0, max_level) : headingSelectors;
        return element.querySelectorAll(maxLevelSelectors.join(', '));
    }

    function buildTocStructure(headings: NodeListOf<HTMLHeadingElement>): TocItem[] {
        const toc: TocItem[] = [];
        const stack: TocItem[] = [];

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName[1]);
            if (max_level && level > max_level) return;

            const item: TocItem = {
                id: heading.id,
                title: heading.textContent || '',
                level,
                children: [],
            };

            while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            if (stack.length > 0) {
                stack[stack.length - 1].children.push(item);
            } else {
                toc.push(item);
            }

            stack.push(item);
        });

        return toc;
    }

    function navigateSmoothly(e: MouseEvent, id: string) {
        e.preventDefault();
        const element = document.getElementById(id);

        if (!element) return;

        updateScrollMarginTop(element);
        element.scrollIntoView({ behavior: 'smooth' });
        /**
         * If we change the hash immediately, the smooth scroll will not work
         * because the browser will try to scroll to the new hash before the
         * previous scroll has completed.
         */
        setTimeout(() => {
            window.location.hash = `#${id}`;
        }, scrollDelay);
    }

    function updateScrollMarginTop(element: HTMLElement): void {
        const newMargin = calculateScrollMarginTop(element);
        element.style.scrollMarginTop = `${newMargin}px`;
    }

    function calculateScrollMarginTop(element: Element): number {
        const headerSize = document.querySelector('#header')?.getBoundingClientRect().height || 0;
        const currentMarginTop = element.computedStyleMap().get('margin-top')?.toString() || '0';

        return headerSize + parseInt(currentMarginTop);
    }

    afterNavigate(() => {
        if (!browser) return;

        initialize();

        setTimeout(() => {
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    updateScrollMarginTop(targetElement as HTMLElement);
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, scrollDelay);
    });
</script>

{#snippet itemElement(tocItem: TocItem)}
    <li class={cn(commonBorderColor, 'text-bold ml-4 flex flex-col border-l leading-7')}>
        <a
            href={`#${tocItem.id}`}
            class={cn(
                commonBorderColor,
                '-ml-px truncate whitespace-nowrap border-l-2 border-transparent pl-4 opacity-50 transition-all duration-100 hover:border-black/40 hover:opacity-100 dark:hover:border-white',
                {
                    'border-l-2 border-black opacity-100 hover:border-black dark:border-white dark:hover:border-white':
                        isActive(tocItem.id),
                }
            )}
            onclick={(e) => navigateSmoothly(e, tocItem.id)}
        >
            {tocItem.title}
        </a>
        {#if tocItem.children.length > 0}
            <ul class="list-none">
                {#each tocItem.children as child}
                    {@render itemElement(child)}
                {/each}
            </ul>
        {/if}
    </li>
{/snippet}

<div class={cn(props.class)}>
    {#if tocData.length > 0}
        <nav>
            <ul class="list-none">
                {#each tocData as item}
                    {@render itemElement(item)}
                {/each}
            </ul>
        </nav>
    {:else}
        <p>No table of contents available</p>
    {/if}
</div>
