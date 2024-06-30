import fs from 'fs';
import path from 'path';
import { Random } from '../utils';

export function readFile(dirname: string, filepath: string): string {
	return fs.readFileSync(path.join(dirname, filepath), 'utf-8');
}

export function createFile(rootDir: string, filepath: string, content: string): void {
	const subdirs = filepath.split('/').slice(0, -1).filter(Boolean);
	const file = filepath.split('/').pop()!;

	fs.mkdirSync(path.resolve(rootDir, ...subdirs), { recursive: true });
	fs.writeFileSync(path.resolve(rootDir, ...subdirs, file), content);
}

export function createFiles(rootDir: string, files: FileMap) {
	for (const [file, content] of Object.entries(files)) {
		createFile(rootDir, file, content);
	}

	return files;
}

export function createTestingDir(): string {
	const dir = fs.mkdirSync(path.resolve(__dirname, Random.id()), {
		recursive: true,
	});

	if (!dir) throw new Error('Could not create test directory');

	return dir;
}

export function deleteDirectory(dir: string) {
	fs.rmSync(dir, { recursive: true });
}

export type FileMap = { [file: string]: string };
