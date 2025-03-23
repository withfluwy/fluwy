import { describe, expect, it } from 'vitest';
import { generateColorsConfig, generateShades } from './index.js';

describe('generateShades', () => {
    it('generates shades from an hex color', () => {
        const primaryColor = '#3b82f6';
        const shades = generateShades(primaryColor);

        expect(shades['500']).toBe(primaryColor.toUpperCase());
        expect(shades).toEqual({
            '50': '#EBF3FE',
            '100': '#2F68C5',
            '200': '#234E94',
            '300': '#183462',
            '400': '#0C1A31',
            '500': '#3B82F6',
            '600': '#6CA1F8',
            '700': '#9DC1FB',
            '800': '#CEE0FD',
            '900': '#FFFFFF',
            '950': '#060D19',
        });
    });
});

describe('generateColorsConfig', () => {
    it('generates the colors from the themes object', () => {
        expect(generateColorsConfig(['primary', 'positive'])).toEqual({
            color: {
                DEFAULT: 'rgb(var(--color) / <alpha-value>)',
                contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
                50: 'rgb(var(--color-50) / <alpha-value>)',
                100: 'rgb(var(--color-100) / <alpha-value>)',
                200: 'rgb(var(--color-200) / <alpha-value>)',
                300: 'rgb(var(--color-300) / <alpha-value>)',
                400: 'rgb(var(--color-400) / <alpha-value>)',
                500: 'rgb(var(--color-500) / <alpha-value>)',
                600: 'rgb(var(--color-600) / <alpha-value>)',
                700: 'rgb(var(--color-700) / <alpha-value>)',
                800: 'rgb(var(--color-800) / <alpha-value>)',
                900: 'rgb(var(--color-900) / <alpha-value>)',
                950: 'rgb(var(--color-950) / <alpha-value>)',
            },
            primary: {
                DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                contrast: 'rgb(var(--color-primary-contrast) / <alpha-value>)',
                50: 'rgb(var(--color-primary-50) / <alpha-value>)',
                100: 'rgb(var(--color-primary-100) / <alpha-value>)',
                200: 'rgb(var(--color-primary-200) / <alpha-value>)',
                300: 'rgb(var(--color-primary-300) / <alpha-value>)',
                400: 'rgb(var(--color-primary-400) / <alpha-value>)',
                500: 'rgb(var(--color-primary-500) / <alpha-value>)',
                600: 'rgb(var(--color-primary-600) / <alpha-value>)',
                700: 'rgb(var(--color-primary-700) / <alpha-value>)',
                800: 'rgb(var(--color-primary-800) / <alpha-value>)',
                900: 'rgb(var(--color-primary-900) / <alpha-value>)',
                950: 'rgb(var(--color-primary-950) / <alpha-value>)',
            },
            positive: {
                DEFAULT: 'rgb(var(--color-positive) / <alpha-value>)',
                contrast: 'rgb(var(--color-positive-contrast) / <alpha-value>)',
                50: 'rgb(var(--color-positive-50) / <alpha-value>)',
                100: 'rgb(var(--color-positive-100) / <alpha-value>)',
                200: 'rgb(var(--color-positive-200) / <alpha-value>)',
                300: 'rgb(var(--color-positive-300) / <alpha-value>)',
                400: 'rgb(var(--color-positive-400) / <alpha-value>)',
                500: 'rgb(var(--color-positive-500) / <alpha-value>)',
                600: 'rgb(var(--color-positive-600) / <alpha-value>)',
                700: 'rgb(var(--color-positive-700) / <alpha-value>)',
                800: 'rgb(var(--color-positive-800) / <alpha-value>)',
                900: 'rgb(var(--color-positive-900) / <alpha-value>)',
                950: 'rgb(var(--color-positive-950) / <alpha-value>)',
            },
        });
    });
});
