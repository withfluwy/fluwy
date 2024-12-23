import { findRoute, type RouteParams } from '../router/route.js';
import { parse } from 'yaml';
import { compile } from '../utils/compile/index.js';
import fs from 'fs';
import path from 'path';
import type {
    Adapter,
    AdapterData,
    Adapters,
    Any,
    AppConfig,
    Context,
    Operation,
    OperationHandlers,
    Operations,
    Plugin,
    RenderResponse,
    RequiredAppConfig,
} from '../contracts.js';
import { str } from '../utils/index.js';
import { AbortOperation } from '@/lib/core/operations/utils.js';
import { createContext } from '@/lib/core/context/index.js';

type DocumentContent = {
    head?: string;
    body: string;
};

export class Application {
    private components: Record<string, Any> = {};
    private operations: OperationHandlers = {};
    private adapters: Adapters = {};
    private registeredPlugins: string[] = [];

    private _config: AppConfig = {
        pages: 'app/pages',
        layouts: 'app/layouts',
        themes: 'app/themes',
        error: () => {
            throw new Error('Uninitialized [error] function in app config');
        },
        redirect: () => {
            throw new Error('Uninitialized [redirect] function in app config');
        },
    };

    public getConfig() {
        return this._config;
    }

    public config(config: RequiredAppConfig): this {
        Object.assign(this._config, config);

        return this;
    }

    public registerComponent(name: string, component: Any) {
        if (name in Object.keys(this.components)) {
            throw new Error(`Component ${name} already registered`);
        }

        this.components[name] = component;
    }

    public getComponent(componentName: string) {
        return this.components[componentName];
    }

    public hasComponent(componentName: string) {
        return Boolean(this.components[componentName]);
    }

    public async render(path: string, options: RenderOptions = {}): Promise<RenderResponse> {
        const route = findRoute(path || 'index', this._config.pages);
        if (!route) throw this._config.error(404, 'Not found');

        const pageDocument = this.getDocument(route.contents);
        const { meta, context } = await this.parseHead(pageDocument, route.params);

        this.checkAuth(meta, options);
        await this.runServerOperations(meta, context, options);

        const content = this.parsePage(pageDocument, { context, meta });

        return {
            theme: this.mergeThemes(meta) ?? {},
            content,
        };
    }

    public async parseDocument(yaml: string) {
        return parse(yaml);
    }

    parsePage(pageDocument: DocumentContent, { context, meta }: { context: Context; meta: PageMeta | undefined }): Any {
        if (!meta?.layout) return parse(compile(pageDocument.body, context.data));

        const layout = this.parseLayout(meta, context);
        const body = parse(compile(pageDocument.body, context.data)) as Any;

        return this.replaceSlot(layout, body);
    }

    private parseLayout(meta: PageMeta, context: Context): Any {
        const layoutContent = this.findLayoutFile(meta.layout!, this._config.layouts);
        if (!layoutContent) throw `Layout not found: [${meta.layout}]`;

        const layoutDocument = this.getDocument(layoutContent);

        this.resolveMeta(meta, layoutDocument);

        return parse(compile(layoutDocument.body, context.data));
    }

    private resolveMeta(meta: PageMeta, layoutDocument: DocumentContent) {
        if (!layoutDocument.head) return;

        const layoutMeta = parse(layoutDocument.head) as PageMeta;

        meta.theme = meta.theme ?? layoutMeta?.theme;
    }

    private findLayoutFile(layoutName: string, layoutsDir: string): string | undefined {
        const layoutFile = path.resolve(process.cwd(), layoutsDir, layoutName + '.yaml');
        if (!fs.existsSync(layoutFile)) return;

        return fs.readFileSync(layoutFile, 'utf8');
    }

    private findThemeFile(themeName: string, themesDir: string): string | undefined {
        const themeFile = path.resolve(process.cwd(), themesDir, themeName + '.yaml');
        if (!fs.existsSync(themeFile)) return;

        return fs.readFileSync(themeFile, 'utf8');
    }

    private getDocument(contents: string): DocumentContent {
        const [part1, part2] = contents.split('---');
        const head = part2 ? part1 : undefined;
        const body = part2 ?? part1;

        return { head, body };
    }

    private async parseHead(
        contents: DocumentContent,
        params: RouteParams
    ): Promise<{ meta?: PageMeta; context: Context }> {
        const context = createContext();
        context.set('params', params);

        if (!contents.head) return { context };

        const meta = parse(contents.head) as PageMeta;

        return { meta, context };
    }

    private async runServerOperations(meta: PageMeta | undefined, context: Context, options: RenderOptions) {
        if (!meta?.server) return { meta, context };

        if (options.auth_token) {
            context.set('auth_token', options.auth_token);
        }

        await this.handleOperations(meta.server, context);

        return { meta, context };
    }

    private checkAuth(meta: PageMeta | undefined, options: RenderOptions) {
        if (meta?.auth && !options.auth_token) this._config.redirect(307, meta.auth);
    }

    private replaceSlot(layout: Any, body: Any[]): Any {
        if (!layout) return body;

        for (const [key, value] of Object.entries(layout)) {
            if (key === 'slot') {
                layout[key] = body;
                continue;
            }

            if (typeof value === 'object') {
                layout[key] = this.replaceSlot(value, body);
            }
        }

        return layout;
    }

    private mergeThemes(meta: PageMeta | undefined): Any {
        if (!meta?.theme) return;

        const themeContents = this.findThemeFile(meta.theme, this._config.themes);

        return themeContents ? parse(themeContents) : undefined;
    }

    plug(plugin: Plugin): this {
        if (this.registeredPlugins.includes(plugin.name)) {
            console.warn(`Plugin [${plugin.name}] already registered`);
            return this;
        }

        /**
         * Register plugin's operations
         */
        for (const [operationName, operationHandler] of Object.entries(plugin.operations ?? {})) {
            const normalizedOperationName = str(operationName).snakeCase();
            this.addOperation(`${plugin.name}.${normalizedOperationName}`, operationHandler);
        }

        /**
         * Register plugin's components
         */
        for (const [componentName, component] of Object.entries(plugin.components ?? {})) {
            const normalizedComponentName = str(componentName).snakeCase();
            this.registerComponent(`${plugin.name}.${normalizedComponentName}`, component);
        }

        /**
         * Register plugin's required plugins
         */
        for (const requiredPlugin of plugin.plugins ?? []) {
            this.plug(requiredPlugin);
        }

        this.registeredPlugins.push(plugin.name);

        return this;
    }

    addAdapter(adapterName: string, adapter: Adapter) {
        if (this.adapters[adapter.name]) throw new Error(`Adapter already exists for [${adapter.name}]`);

        this.adapters[adapterName] = adapter;

        return this;
    }

    addOperation(operation: string, handler: Operation) {
        if (this.operations[operation]) return this;

        this.operations[operation] = handler;

        return this;
    }

    async handleOperation(event: string, args: Any, context: Context, previousResult: Any) {
        const handle = this.operations[event];

        if (!handle) throw new Error(`Operation [${event}] not found`);

        return handle(args, { context, previousResult });
    }

    async handleOperations(operations: Any, context: Context, initialResults?: Any): Promise<Any> {
        let result = initialResults;

        if (!operations) return;

        try {
            if (typeof operations === 'string') return await this.handleOperation(operations, {}, context, result);
            if (typeof operations !== 'object')
                throw new Error(`Invalid User Action document [${JSON.stringify(operations)}]`);

            if (Array.isArray(operations)) {
                for (const operation of operations) {
                    for (const [action, args] of Object.entries(operation)) {
                        result = await this.handleOperation(action, args, context, result);
                    }
                }

                return result;
            }

            for (const [operation, args] of Object.entries(operations || {})) {
                result = await this.handleOperation(operation, args, context, result);
            }

            return result;
        } catch (error) {
            if (error instanceof AbortOperation) return;

            throw error;
        }
    }

    async handleAdapter(adapterName: string = '', data: Any, context: Context): Promise<AdapterData> {
        if (!adapterName) return { data, context };

        const adapter = this.adapters[adapterName];

        if (!adapter) throw new Error(`No adapter defined for [${adapterName}]`);

        return adapter(data, context);
    }
}

export function createApp() {
    return new Application();
}

export const app = createApp();

export type PageMeta = {
    layout?: string;
    theme?: string;
    auth?: string;
    server?: Operations;
};

export type RenderOptions = {
    auth_token?: string;
};
