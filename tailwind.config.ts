import { extractTailwindOnYaml, getColors } from './src/lib/integrations/tailwind/index.js';
import path from 'path';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: {
        files: ['./src/**/*.{html,js,svelte,ts,yml,yaml}', './app/**/*.{yml,yaml}'],
        extract: {
            yaml: extractTailwindOnYaml,
        },
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    '2xl': '1400px',
                },
            },
            colors: getColors(path.join(__dirname, './app/themes')),
        },
    },
    plugins: [import('@tailwindcss/typography')],
};
