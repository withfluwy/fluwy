import { extractTailwindOnYaml } from './src/lib/core/utils/extract-tailwind-on-yaml/index.js';

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
			colors: {
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
			},
		},
	},
	plugins: [],
};
