import { expect, test } from '@playwright/test';

test('has screenshot', async ({ page }) => {
    await page.goto('/dashboard-layout');
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01, fullPage: true });
});
