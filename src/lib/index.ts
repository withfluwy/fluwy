import * as forms from './components/forms/index.js';
import * as primitives from './components/primitives/index.js';
import * as controls from './components/controls/index.js';
import * as layouts from './components/layouts/index.js';
import * as common from './components/common/index.js';
import * as displays from './components/displays/index.js';
import 'iconify-icon';
import * as plugins from '@/lib/plugins/index.js';
export { sveltekit } from '@/lib/integrations/index.js';
import {
    AbortOperationError,
    UnauthenticatedError,
    App,
    compile,
    createContext,
    Render,
    type Any,
    useContext,
    utils,
    Application,
    installOperations,
} from '@/lib/core/index.js';

function registerAll(app: Application, imports: Record<string, Any>) {
    for (const [key, value] of Object.entries(imports)) {
        if (app.hasComponent(key)) throw new Error(`Component [${key}] already registered`);

        app.registerComponent(utils.str(key).snakeCase(), value);
    }
}

export function createApp() {
    const app = new Application();
    installOperations(app);

    registerAll(app, forms);
    registerAll(app, primitives);
    registerAll(app, controls);
    registerAll(app, layouts);
    registerAll(app, common);
    registerAll(app, displays);

    return app;
}

export const app = createApp();

// Exports
export {
    AbortOperationError,
    App,
    compile,
    createContext,
    plugins,
    registerAll,
    Render,
    UnauthenticatedError,
    useContext,
    utils,
};
export type { ElementProps, FormState, Operation, Plugin } from './core/contracts.js';
