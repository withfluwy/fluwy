import * as forms from './components/forms/index.js';
import * as primitives from './components/primitives/index.js';
import * as controls from './components/controls/index.js';
import * as layouts from './components/layouts/index.js';
import * as common from './components/common/index.js';
import { createApp } from './core/app/index.js';
import { str } from './core/utils/index.js';
import type { Any } from './core/contracts.js';
import App from './core/app.svelte';
import 'iconify-icon';

const app = createApp();

function registerAll(imports: Record<string, Any>) {
    for (const [key, value] of Object.entries(imports)) {
        if (app.hasComponent(key)) throw new Error(`Component [${key}] already registered`);

        app.registerComponent(str(key).snakeCase(), value);
    }
}

registerAll(forms);
registerAll(primitives);
registerAll(controls);
registerAll(layouts);
registerAll(common);

// Exports

export type { ElementProps } from './core/contracts.js';
export { app, registerAll, App, forms, primitives, controls, str };
