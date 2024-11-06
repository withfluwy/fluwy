import { expect, type Page } from '@playwright/test';

export function checkScreenshot(page: Page) {
    return expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.2, fullPage: true });
}

type ScreenshotTestOptions = {
    viewport?: { width: number; height: number };
    darkMode?: boolean;
};

export function screenshotTest({ viewport = { width: 1024, height: 768 }, darkMode }: ScreenshotTestOptions = {}) {
    return async ({ page }: { page: Page }) => {
        await page.setViewportSize(viewport);

        if (darkMode) {
            await page.emulateMedia({ colorScheme: 'dark' });
        }

        await page.goto('http://localhost:4173/components/buttons/tests');

        await checkScreenshot(page);
    };
}
