import { test, expect } from '@playwright/test';

test('getting started doc page', async ({ page }) => {
    await page.goto('/getting-started');
    await expect(page.getByRole('heading', { name: 'Getting Started' })).toBeVisible();
    await expect(page.getByText("We're excited to have you on")).toBeVisible();
    await expect(page.getByRole('link', { name: 'Join our community' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Subscribe to our channel' })).toBeVisible();
    await expect(page.getByText('pnpx degit withfluwy/fluwy-')).toBeVisible();
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02, fullPage: true });
});
