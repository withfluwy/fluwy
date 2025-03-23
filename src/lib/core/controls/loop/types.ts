import type { ContextData, Template } from '@/lib/core/contracts.js';

export interface LoopItem {
    template: Template;
    context: Omit<ContextData, 'svelteKit'>;
}
