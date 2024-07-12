import * as components from './components/index.js';
import * as primitives from './components/primitives/index.js';
import * as controls from './components/controls/index.js';
import { createApp } from './core/app/index.js';
import { str } from './core/utils/index.js';
import type { Any } from './core/contracts.js';
import App from './core/app.svelte';

const app = createApp();

function registerAll(imports: Record<string, Any>) {
    for (const [key, value] of Object.entries(imports)) {
        if (app.hasComponent(key)) throw new Error(`Component [${key}] already registered`);

        app.registerComponent(str(key).kebabCase(), value);
    }
}

registerAll(primitives);
registerAll(components);
registerAll(controls);

// Exports

export type { ElementProps } from './core/contracts.js';
export { app, registerAll, App, primitives, components, controls, str };
