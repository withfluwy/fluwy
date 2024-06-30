import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import type { Any } from '../contracts';

export class Route implements IRoute {
	path: string;
	filepathAbsolute = '';
	directory: string;
	private _contents: string | undefined;

	constructor({ path, directory }: Pick<IRoute, 'path' | 'directory'>) {
		this.path = this.sanitizePath(path);
		this.directory = directory;
	}

	get contents(): string {
		return (this._contents ??= fs.readFileSync(this.filepathAbsolute, 'utf8'));
	}

	get fileExists(): boolean {
		return fs.existsSync(this.filepathAbsolute);
	}

	get filepath(): string {
		return this.filepathAbsolute.replace(this.directory, '');
	}

	get params(): RouteParams {
		const { filepath, path } = this;
		const parts = path.split('/').filter(Boolean);
		const matches = filepath.split('/').filter(Boolean);
		const params: { [param: string]: string | number } = {};

		for (const [index, match] of matches.entries()) {
			if (!hasBracked(match)) continue;
			const value: string | number = parts[index];

			params[match.slice(1, -1)] = isNaN(Number(value)) ? value : Number(value);
		}

		return params;
	}

	private sanitizePath(path: string): string {
		const trailingSlash = /\/$/;

		return path.replace(trailingSlash, '');
	}
}

export function findRoute(routePath: string, appDirectory: string): Route | undefined {
	const route = new Route({ path: routePath, directory: appDirectory });

	route.filepathAbsolute = path.join(`${appDirectory}`, `${route.path}/index.yaml`);
	if (route.fileExists) return route;

	route.filepathAbsolute = path.join(`${appDirectory}`, `${route.path}.yaml`);
	if (route.fileExists) return route;

	const parts = route.path.split('/').filter(Boolean);
	const matches = [];

	for (const [index, part] of parts.entries()) {
		const files = readFiles(
			index === 0 ? appDirectory : `${appDirectory}/${matches.join('/')}`
		);
		const directories = files.filter(isDirectory);
		const paramDirectory = directories.find(hasBracked);

		if (directories.includes(part)) {
			matches.push(part);
			continue;
		}

		if (paramDirectory) {
			matches.push(paramDirectory);
			continue;
		}

		const isLastPart = index === parts.length - 1;
		if (files.includes(`${part}.yaml`) && isLastPart) {
			route.filepathAbsolute = `${appDirectory}/${matches.join('/')}/${part}.yaml`;
			return route;
		}

		return;
	}

	route.filepathAbsolute = `${appDirectory}/${matches.join('/')}/index.yaml`;

	return route.fileExists ? route : undefined;
}

export function readYamlFile(filepath: string, directory: string) {
	const layoutFile = path.resolve(directory, filepath);
	if (!fs.existsSync(layoutFile)) return;

	return parse(fs.readFileSync(layoutFile, 'utf8'));
}

function readFiles(appDirectory: string): string[] {
	return fs.readdirSync(appDirectory);
}

function hasBracked(name: string): boolean {
	return name.startsWith('[') && name.endsWith(']');
}

const isDirectory = (path: string) => !path.includes('.');

export interface PageDocument {
	meta: {
		layout: string;
		title: string;
	};
	body: Any;
}

interface IRoute {
	contents: string;
	directory: string;
	filepathAbsolute: string;
	filepath: string;
	params: RouteParams;
	path: string;
}

export type RouteParams = Record<string, string | number>;
