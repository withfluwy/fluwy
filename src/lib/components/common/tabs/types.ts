import type { Template } from '@/lib/core/contracts.js';

export const TabsKey = Symbol('Fluwy.Tabs');
export interface Tab {
    id?: string;
    class?: string;
    title: Template;
    panel: Template;
    outer_radius?: boolean | 'off';
    active_by_default?: boolean;
}

export interface TabsContract {
    activeTab?: Tab;

    isActive(id: string): boolean;
    setActiveTab(id: string): void;
}
