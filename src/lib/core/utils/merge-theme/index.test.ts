import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { mergeTheme } from './index.js';

const theme1 = parse(`
button:
    filled: bg-primary text-primary-foreground
    outline: border border-primary
    nested:
        property: value
`);

const theme2 = parse(`
button:
    filled: bg-red-500
    outline: uppercase
    something: new
    nested:
        property: another-value
`);

const wrongTheme = parse(`
button:
    filled:
        default: bg-primary text-primary-foreground
`);

describe('mergeTheme', () => {
	it('merge two yaml files into one', () => {
		expect(mergeTheme(theme1, theme2)).toEqual({
			button: {
				filled: 'text-primary-foreground bg-red-500',
				outline: 'border border-primary uppercase',
				something: 'new',
				nested: {
					property: 'value another-value'
				}
			}
		});
	});

	it('throws an error if the values are not of the same type', () => {
		expect(() => mergeTheme(theme1, wrongTheme)).toThrowError(
			'Property "filled" is of type string but the second one is of type object'
		);
	});

	it('return the defined object if one is undefined', () => {
		expect(mergeTheme(theme1, undefined)).toEqual(theme1);
		expect(mergeTheme(undefined, theme2)).toEqual(theme2);
	});
});
