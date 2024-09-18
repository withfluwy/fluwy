import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'pnpm preview',
        port: 4173,
        reuseExistingServer: !process.env.CI,
    },
    testDir: 'tests',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        viewport: { width: 1920, height: 1080 },
    },
};

export default config;
