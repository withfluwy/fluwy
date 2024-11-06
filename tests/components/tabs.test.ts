import { expect, test } from '@playwright/test';
import { checkScreenshot } from '../utils.js';

test('tabs doc page', async ({ page }) => {
    await page.goto('http://localhost:4173/components/tabs');

    // Light mode
    await checkScreenshot(page);

    // Dark mode
    await page.getByRole('button').nth(1).click();
    await page.getByText('Dark', { exact: true }).click();
    await checkScreenshot(page);
    await page.getByRole('tab', { name: 'Variables' }).click();
    await expect(page.getByText('common: tab: class:')).toBeVisible();
    await checkScreenshot(page);
});

test('tabs tests page', async ({ page }) => {
    await page.goto('http://localhost:4173/components/tabs/tests');
    await page.getByRole('tab', { name: 'Tab 2.2' }).click();
    await expect(page.getByText('Content of tab 2.2')).toBeVisible();
    await expect(page.getByText('Content of tab 2.1')).not.toBeVisible();

    await checkScreenshot(page);
});

test('tabs theme tests page', async ({ page }) => {
    await page.goto('http://localhost:4173/components/tabs/test-theme');
    await checkScreenshot(page);
});
