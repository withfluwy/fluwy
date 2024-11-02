import { test, expect } from '@playwright/test';

test('theme doc page', async ({ page }) => {
    await page.goto('/theming');
    await expect(page.getByRole('heading', { name: 'Theme System' })).toBeVisible();
    await expect(page.getByText('To apply a theme across all')).toBeVisible();
    await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02, fullPage: true });
});
