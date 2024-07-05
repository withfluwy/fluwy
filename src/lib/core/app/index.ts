import type { SvelteComponent } from 'svelte';
import { error, redirect } from '@sveltejs/kit';
import { findRoute, type RouteParams } from '../router/route.js';
import { parse } from 'yaml';
import { compile } from '../utils/compile/index.js';
import fs from 'fs';
import path from 'path';
import type { Any, RenderResponse } from '../contracts.js';
import { get } from '../utils/index.js';

type DocumentContent = {
	head?: string;
	body: string;
};

export class App {
	private components: Record<string, SvelteComponent> = {};

	public config = {
		components: 'app/components',
		pages: 'app/pages',
		layouts: 'app/layouts',
		themes: 'app/themes',
	};

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
		const route = findRoute(path || 'index', this.config.pages);
		if (!route) throw error(404, 'Not found');

		const content = this.getDocument(route.contents);
		const { meta, context } = await this.parseHead(content, route.params, options);

		this.checkAuth(meta, options);
		await this.executeHead(meta, context, options);

		return {
			theme: this.mergeThemes(meta),
			content: this.parsePage(content, { context, meta }),
		};
	}

	public async parseDocument(yaml: string) {
		return parse(yaml);
	}

	parsePage(content: DocumentContent, { context, meta }: { context: PageContext; meta: PageMeta | undefined }): Any {
		if (!meta?.layout) return parse(compile(content.body, context));

		const layoutContent = this.findLayoutFile(meta.layout, this.config.layouts);
		if (!layoutContent) throw `Layout not found: [${meta.layout}]`;

		const layout = parse(compile(layoutContent, context));
		const body = parse(compile(content.body, context)) as Any;

		return this.replaceSlot(layout, body);
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
		params: RouteParams,
		options: RenderOptions
	): Promise<{ meta?: PageMeta; context: PageContext }> {
		const context: PageContext = { params };

		if (!contents.head) return { context };

		const meta = parse(contents.head) as PageMeta;

		return { meta, context };
	}

	private async executeHead(meta: PageMeta | undefined, context: PageContext, options: RenderOptions) {
		if (!meta) return { meta, context };

		await this.resolveLoaders(meta, context, options);
		this.resolveVars(meta, context);

		return { meta, context };
	}

	private checkAuth(meta: PageMeta | undefined, options: RenderOptions) {
		if (meta?.auth && !options.auth_token) redirect(307, meta.auth);
	}

	private async resolveLoaders(meta: PageMeta, context: PageContext, options: RenderOptions) {
		for (const [varName, loadPath] of Object.entries(meta.load || {})) {
			const url = typeof loadPath === 'string' ? loadPath : (loadPath as LoadParams).url;
			const path = typeof loadPath === 'string' ? '' : (loadPath as LoadParams).path ?? '';
			const parsedUrl = compile(url, context);

			const headers = new Headers();
			if (options.auth_token) headers.append('Authorization', `Bearer ${options.auth_token}`);
			const response = await fetch(parsedUrl, { headers });

			if (response.status === 404) throw error(404, 'Not found');
			if (!response.ok) throw error(response.status, 'Error loading data');

			const data = await response.json();

			context[varName] = path ? get(data, path) : data;
		}
	}

	private resolveVars(meta: PageMeta, context: PageContext) {
		for (const [varName, value] of Object.entries(meta.vars ?? {})) {
			context[varName] = compile(value, context);
		}
	}

	replaceSlot(layout: Any, body: Any[]): Any {
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

		const themeContents = this.findThemeFile(meta.theme, this.config.themes);

		return themeContents ? parse(themeContents) : undefined;
	}
}

export function createApp() {
	return new App();
}

export interface PageSchema {
	page: Any;
	params: RouteParams;
}

export interface PageContext {
	params: RouteParams;
	[key: string]: Any;
}

export type PageMeta = {
	layout?: string;
	theme?: string;
	auth?: string;
	load?: string | LoadParams;
	vars?: Record<string, string>;
};

type LoadParams = { url: string; path?: string };

export type RenderOptions = {
	auth_token?: string;
};
