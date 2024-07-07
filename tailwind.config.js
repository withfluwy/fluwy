import { extractTailwindOnYaml, readColorsFrom, generateColorsConfig } from './src/lib/integrations/tailwind/index.js';

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
			colors: generateColorsConfig(readColorsFrom('./src/app/themes')),
		},
	},
	plugins: [],
};
