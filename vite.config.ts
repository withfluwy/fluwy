import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';

export default defineConfig({
    plugins: [sveltekit(), svelteTesting()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
        environment: 'jsdom',
        coverage: {
            provider: 'istanbul',
            skipFull: true,
        },
        globals: true,
        setupFiles: ['src/setup-tests.ts'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
