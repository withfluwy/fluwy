import { getContext, setContext } from 'svelte';
import { TabsKey, type TabsContract } from './types.js';

export function setTabs(tabs: TabsContract) {
    setContext(TabsKey, () => tabs);
}

export function useTabs(): TabsContract {
    const tabs: () => TabsContract = getContext(TabsKey);

    return tabs();
}
