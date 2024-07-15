import { describe, expect, it, vi } from 'vitest';
import { generateColorVariables, setCurrentColor } from './index.js';

const colors = {
    primary: {
        DEFAULT: '#3B82F6',
        50: '#EBF2FE',
        100: '#D7E6FD',
    },
};

describe('setCurrentColor', () => {
    it('returns css variables for the current color', () => {
        const variables = setCurrentColor('primary', colors);
        expect(variables).toBe(
            `--color-50: 235 242 254;\n--color-100: 215 230 253;\n--color: 59 130 246;\n--color-contrast: 255 255 255;\n`
        );
    });
});

describe('generateColorVariables', () => {
    it('returns css variables for all the colors', () => {
        const variables = generateColorVariables(colors);
        expect(variables).toContain('--color-primary-50: 235 242 254;');
        expect(variables).toContain('--color-primary-100: 215 230 253;');
        expect(variables).toContain('--color-primary: 59 130 246;');
        expect(variables).toContain('--color-primary-contrast: 255 255 255;');
        expect(variables).toEqual(
            `--color-primary-50: 235 242 254;\n--color-primary-100: 215 230 253;\n--color-primary: 59 130 246;\n--color-primary-contrast: 255 255 255;\n`
        );
    });
});
