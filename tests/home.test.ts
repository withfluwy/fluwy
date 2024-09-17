import { expect, test } from '@playwright/test';

test('light mode', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot();
});

test('dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page).toHaveScreenshot();
});
