import { expect, type Page } from '@playwright/test';

export function checkScreenshot(page: Page) {
    return expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01, fullPage: true });
}

type ScreenshotTestOptions = {
    viewport?: { width: number; height: number };
    darkMode?: boolean;
};

export function screenshotTest(
    url: string,
    { viewport = { width: 1024, height: 768 }, darkMode }: ScreenshotTestOptions = {}
) {
    return async ({ page }: { page: Page }) => {
        await page.setViewportSize(viewport);

        if (darkMode) {
            await page.emulateMedia({ colorScheme: 'dark' });
        }

        await page.goto(url);

        await checkScreenshot(page);
    };
}
