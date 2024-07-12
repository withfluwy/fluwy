import { extractTailwindOnYaml, getColors } from './src/lib/integrations/tailwind/index.js';
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
    content: {
        files: ['./src/**/*.{html,js,svelte,ts,yml,yaml}'],
        extract: {
            yaml: extractTailwindOnYaml,
        },
    },
    theme: {
        extend: {
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    '2xl': '1400px',
                },
            },
            colors: getColors(path.join(__dirname, './src/app/themes')),
        },
    },
    plugins: [import('@tailwindcss/typography')],
};
