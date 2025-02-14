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
    ContextData,
    Operation,
    OperationHandlers,
    Operations,
    Plugin,
    RenderResponse,
    RequiredAppConfig,
} from '../contracts.js';
import { str } from '../utils/index.js';
import { AbortOperationError, UnauthenticatedError } from '@/lib/core/errors/index.js';
import { createContext } from '@/lib/core/context/index.js';
import { evaluate } from '@/lib/core/controls/condition/index.js';

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

    /**
     * Uses the `redirect` function from the app config. Usually the sveltekit `redirect` function.
     */
    public redirect(status: number, location: string | URL): never {
        throw this._config.redirect(status, location);
    }

    public notFound(message?: string): never {
        throw this._config.error(404, message ?? 'Not found');
    }

    public error(status: number, message?: string): never {
        throw this._config.error(status, message);
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

        const context = this.createContext(route.params, options);
        const pageDocument = this.getDocument(route.contents);
        const pageHead = this.getPageHead(pageDocument);
        const layoutDocument = this.getLayoutDocument(pageHead);
        const layoutHead = this.getLayoutHead(layoutDocument);

        await this.runServerOperations({ pageHead, layoutHead, context });

        const content = this.parsePage(pageDocument, { context, head: pageHead });

        return {
            theme: this.mergeThemes(pageHead) ?? {},
            content,
            context: this.getContextData(context.data),
        };
    }

    private getPageHead(pageDocument: DocumentContent): PageHead | undefined {
        if (!pageDocument.head) return;

        return parse(pageDocument.head) as PageHead;
    }

    private getLayoutDocument(pageHead?: PageHead | undefined): DocumentContent | undefined {
        if (!pageHead?.layout) return;

        const layoutContent = this.findLayoutFile(pageHead.layout, this._config.layouts);
        if (!layoutContent) throw `Layout not found: [${pageHead.layout}]`;

        return this.getDocument(layoutContent);
    }

    private getLayoutHead(layoutDocument: DocumentContent | undefined): CommonHead | undefined {
        if (!layoutDocument?.head) return;

        return parse(layoutDocument.head) as CommonHead;
    }

    private createContext(params: RouteParams, options: RenderOptions): Context {
        const context = createContext();
        context.set('params', params);

        if (options.auth_token) context.set('auth_token', options.auth_token);

        return context;
    }

    public async parseDocument(yaml: string) {
        return parse(yaml);
    }

    private parsePage(
        pageDocument: DocumentContent,
        { context, head }: { context: Context; head: PageHead | undefined }
    ): Any {
        if (!head?.layout) return parse(compile(pageDocument.body, context.data));

        const layout = this.parseLayout(head, context);
        const body = parse(compile(pageDocument.body, context.data)) as Any;

        return this.replaceSlot(layout, body);
    }

    private parseLayout(head: PageHead, context: Context): Any {
        const layoutContent = this.findLayoutFile(head.layout!, this._config.layouts);
        if (!layoutContent) throw `Layout not found: [${head.layout}]`;

        const layoutDocument = this.getDocument(layoutContent);

        this.resolveLayoutHead(head, layoutDocument);

        return parse(compile(layoutDocument.body, context.data));
    }

    private resolveLayoutHead(head: CommonHead, layoutDocument: DocumentContent) {
        if (!layoutDocument.head) return;

        const layoutHead = parse(layoutDocument.head) as CommonHead;

        head.theme = head.theme ?? layoutHead?.theme;
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

    private async runServerOperations({
        pageHead,
        layoutHead,
        context,
    }: {
        pageHead?: PageHead;
        layoutHead?: CommonHead;
        context: Context;
    }) {
        if (!pageHead?.server && !layoutHead?.server) return;

        try {
            await this.handleOperations(layoutHead?.server, context);
            await this.handleOperations(pageHead?.server, context);
        } catch (error) {
            await this.handleError(error);
        }
    }

    private replaceSlot(layout: Any, body: Any[]): Any {
        if (!layout) return body;

        for (const [key, value] of Object.entries(layout)) {
            if (key === 'slot') {
                layout[key] = body;
                continue;
            }

            if (value !== null && typeof value === 'object') {
                layout[key] = this.replaceSlot(value, body);
            }
        }

        return layout;
    }

    private mergeThemes(meta: PageHead | undefined): Any {
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

        return handle(args, { context, previousResult, app: this });
    }

    private extractOperationEntries(entries: [string, Any][]) {
        return {
            mainIf: entries.find(([key]) => key.startsWith('if ')),
            elseIfs: entries.filter(([key]) => key.startsWith('else if ')),
            elseEntry: entries.find(([key]) => key === 'else'),
            regularOps: entries.filter(
                ([key]) => !key.startsWith('if ') && !key.startsWith('else if ') && key !== 'else'
            ),
        };
    }

    private async handleRegularOperations(operations: [string, Any][], context: Context, result: Any): Promise<Any> {
        let currentResult = result;
        for (const [operation, args] of operations) {
            currentResult = await this.handleOperation(operation, args, context, currentResult);
        }
        return currentResult;
    }

    private async handleConditionalOperations(
        mainIf: [string, Any],
        elseIfs: [string, Any][],
        elseEntry: [string, Any] | undefined,
        context: Context,
        result: Any,
        evaluate: (condition: string, context: Context) => boolean
    ): Promise<Any> {
        const [condition, ops] = mainIf;

        if (evaluate(condition, context)) {
            return await this.handleOperations(ops, context, result);
        }

        // Try else-if conditions
        for (const [elseIfCond, elseIfOps] of elseIfs) {
            // Convert 'else if x' to 'if x' for evaluation
            const ifCondition = 'if ' + elseIfCond.substring(8);
            if (evaluate(ifCondition, context)) {
                return await this.handleOperations(elseIfOps, context, result);
            }
        }

        // If no else-if matched, try else
        if (elseEntry) {
            const [, elseOps] = elseEntry;
            return await this.handleOperations(elseOps, context, result);
        }

        return result;
    }

    private async handleOperationBlock(
        entries: [string, Any][],
        context: Context,
        result: Any,
        evaluate: (condition: string, context: Context) => boolean
    ): Promise<Any> {
        const { mainIf, elseIfs, elseEntry, regularOps } = this.extractOperationEntries(entries);

        let currentResult = result;

        // Handle conditional operations first
        if (mainIf) {
            currentResult = await this.handleConditionalOperations(
                mainIf,
                elseIfs,
                elseEntry,
                context,
                currentResult,
                evaluate
            );
        }

        // Handle regular operations
        currentResult = await this.handleRegularOperations(regularOps, context, currentResult);

        return currentResult;
    }

    async handleOperations(operations: Any, context: Context, initialResults?: Any): Promise<Any> {
        let result = initialResults;

        if (!operations) return result;

        try {
            if (typeof operations === 'string') {
                return await this.handleOperation(operations, {}, context, result);
            }

            if (typeof operations !== 'object') {
                throw new Error(`Invalid User Action document [${JSON.stringify(operations)}]`);
            }

            if (Array.isArray(operations)) {
                for (const operation of operations) {
                    const entries = Object.entries(operation);
                    result = await this.handleOperationBlock(entries, context, result, evaluate);
                }
                return result;
            }

            // Handle object format
            const entries = Object.entries(operations || {});
            return await this.handleOperationBlock(entries, context, result, evaluate);
        } catch (error) {
            if (error instanceof AbortOperationError) return result;
            throw error;
        }
    }

    async handleAdapter(adapterName: string = '', data: Any, context: Context): Promise<AdapterData> {
        if (!adapterName) return { data, context };

        const adapter = this.adapters[adapterName];

        if (!adapter) throw new Error(`No adapter defined for [${adapterName}]`);

        return adapter(data, context);
    }

    async handleError(error: Any) {
        if (error instanceof UnauthenticatedError) {
            const redirect = error.params?.redirect ?? '/login';

            this._config.redirect(307, redirect);
        }

        throw error;
    }

    private getContextData(contextData: ContextData): Any {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { svelteKit, response, ...rest } = contextData;

        return rest;
    }
}

// export const app = createApp();

export interface CommonHead {
    theme?: string;
    server?: Operations;
}

export interface PageHead extends CommonHead {
    layout?: string;
}

export type RenderOptions = {
    auth_token?: string;
};
