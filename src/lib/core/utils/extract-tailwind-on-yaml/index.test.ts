import { describe, expect, it } from 'vitest';
import { extractTailwindOnYaml } from './index.js';

describe('extractTailwindOnYaml', () => {
	it('should extract all classes', () => {
		expect(extractTailwindOnYaml('class: foo bar baz')).toEqual(['foo', 'bar', 'baz']);
	});

	it('should extract classes from other directives', () => {
		expect(extractTailwindOnYaml('primary: bg-blue-500 text-white')).toEqual(['bg-blue-500', 'text-white']);
	});

	it('should handle empty line', () => {
		expect(extractTailwindOnYaml('')).toEqual([]);
	});

	it('should handle non-matching line', () => {
		expect(extractTailwindOnYaml('hello world')).toEqual([]);
	});
});
