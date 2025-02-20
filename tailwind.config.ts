import { getColors } from './src/lib/integrations/tailwind/index.js';
import path from 'path';

/** @type {import('@tailwindcss/types').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts,yml,yaml}', './app/**/*.{yml,yaml}'],
    theme: {
        extend: {
            colors: getColors(path.join(__dirname, './app/themes')),
        },
    },
};
