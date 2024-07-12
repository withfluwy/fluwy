import { Colors, type ColorPalette } from '../../core/styles.js';
import Color from 'color';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export function extractTailwindOnYaml(line: string): string[] {
    const regex = /[a-zA-Z0-9_-]+: (.*)$/g;
    const match = line.match(regex) || [];

    if (!match.length) return [];

    const classes = match
        .map((m) =>
            m
                .split(' ')
                .filter((s) => !s.endsWith(':'))
                .flat()
        )
        .flat();

    return classes;
}

export function readColorsFrom(dirpath: string): string[] {
    const colors = new Set();
    for (const file of fs.readdirSync(dirpath)) {
        const content = fs.readFileSync(path.join(dirpath, file), 'utf8');
        const theme = yaml.parse(content);

        Object.keys(theme?.colors ?? {}).forEach(colors.add.bind(colors));
    }

    return [...colors.values()] as string[];
}

export function generateShades(hexColor: string) {
    const baseColor = Color(hexColor);
    const brightness = baseColor.luminosity();

    let baseShade;
    if (brightness < 0.3) {
        baseShade = 500;
    } else if (brightness < 0.6) {
        baseShade = 400;
    } else {
        baseShade = 300;
    }

    const shades: { [key: number]: string } = {};

    // Generate the lightest shade (50)
    shades[50] = baseColor.mix(Color('#ffffff'), 0.9).hex();

    // Generate darker shades in multiples of 100
    for (let i = 1; i <= baseShade / 100; i++) {
        const shadeValue = 1 - i / (baseShade / 100);
        shades[i * 100] = baseColor.mix(Color('#000000'), 1 - shadeValue).hex();
    }

    // Add the base color itself
    shades[baseShade] = baseColor.hex();

    // Generate lighter shades in multiples of 100
    for (let i = 1; i <= (900 - baseShade) / 100; i++) {
        const shadeValue = i / ((900 - baseShade) / 100);
        shades[baseShade + i * 100] = baseColor.mix(Color('#ffffff'), shadeValue).hex();
    }

    // Generate the darkest shade (950)
    shades[950] = baseColor.mix(Color('#000000'), 0.9).hex();

    return shades;
}

export function generateColorsConfig(colors: string[]): ColorPalette {
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const config: ColorPalette = {
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
    };
    for (const color of colors) {
        config[color] = {};

        config[color]['DEFAULT'] = `rgb(var(--color-${color}) / <alpha-value>)`;
        config[color]['contrast'] = `rgb(var(--color-${color}-contrast) / <alpha-value>)`;

        for (const shade of shades) {
            config[color][shade] = `rgb(var(--color-${color}-${shade}) / <alpha-value>)`;
        }
    }

    return config;
}

export function getColors(pathname: string) {
    const defaultColors = Object.keys(Colors);
    const colorsFromThemFile = readColorsFrom(pathname);
    const colors = new Set([...defaultColors, ...colorsFromThemFile]);

    return generateColorsConfig([...colors.values()]);
}
