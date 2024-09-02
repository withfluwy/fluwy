import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { mergeObjects } from './index.js';

const theme1 = parse(`
button:
    filled: bg-primary text-primary-foreground
    outline: border border-primary
    third: value
    nested:
        property: value
`);

const theme2 = parse(`
button:
    filled: bg-red-500
    outline: uppercase
    third:
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
        expect(mergeObjects(theme1, theme2)).toEqual({
            button: {
                filled: 'text-primary-foreground bg-red-500',
                outline: 'border border-primary uppercase',
                something: 'new',
                third: 'value',
                nested: {
                    property: 'value another-value',
                },
            },
        });
    });

    it('throws an error if the values are not of the same type', () => {
        expect(() => mergeObjects(theme1, wrongTheme)).toThrowError(
            'Property "filled" is of type string but the second one is of type object'
        );
    });

    it('return the defined object if one is undefined', () => {
        expect(mergeObjects(theme1, undefined)).toEqual(theme1);
        expect(mergeObjects(undefined, theme2)).toEqual(theme2);
    });

    it('merges nested objects and ignore null values', () => {
        expect(mergeObjects(theme1, theme2).button.third).toEqual('value');
    });

    it('merges other values then objects', () => {
        expect(mergeObjects('md', 'lg')).toEqual('lg');
        expect(mergeObjects(true, false)).toEqual(false);
        expect(mergeObjects(10, 12)).toEqual(12);
    });

    it('doesnt duplicate values', () => {
        expect(mergeObjects({ primary: '#fff' }, { primary: '#fff' })).toEqual({ primary: '#fff' });
        expect(mergeObjects({ primary: '#ff1' }, { primary: '#ff2' })).toEqual({ primary: '#ff2' });
    });
});
