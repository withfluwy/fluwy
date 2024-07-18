import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'pnpm preview',
        port: 4173,
    },
    testDir: 'tests',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
};

export default config;
