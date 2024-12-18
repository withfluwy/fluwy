import * as forms from './components/forms/index.js';
import * as primitives from './components/primitives/index.js';
import * as controls from './components/controls/index.js';
import * as layouts from './components/layouts/index.js';
import * as common from './components/common/index.js';
import * as displays from './components/displays/index.js';
import 'iconify-icon';
import * as plugins from '@/lib/plugins/index.js';
import {
    abort,
    AbortOperation,
    app,
    App,
    compile,
    createApp,
    createContext,
    Render,
    type Any,
    useContext,
    utils,
} from '@/lib/core/index.js';

function registerAll(imports: Record<string, Any>) {
    for (const [key, value] of Object.entries(imports)) {
        if (app.hasComponent(key)) throw new Error(`Component [${key}] already registered`);

        app.registerComponent(utils.str(key).snakeCase(), value);
    }
}

registerAll(forms);
registerAll(primitives);
registerAll(controls);
registerAll(layouts);
registerAll(common);
registerAll(displays);

// Exports
export {
    abort,
    AbortOperation,
    app,
    App,
    compile,
    createApp,
    createContext,
    plugins,
    registerAll,
    Render,
    useContext,
    utils,
};
export type { ElementProps, FormState, Operation, Plugin } from './core/contracts.js';
