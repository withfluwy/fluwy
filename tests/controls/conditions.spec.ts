import { test } from '@playwright/test';
import { checkScreenshot } from '../utils.js';

test('check conditions', async ({ page }) => {
    await page.goto('/controls/conditions/tests');

    await checkScreenshot(page);
});
