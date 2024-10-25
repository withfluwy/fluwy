import { test, expect } from '@playwright/test';

test('navigation', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    await page.goto('http://localhost:4173/');
    await page.getByRole('link', { name: 'Getting Started' }).click();
    await expect(page.getByRole('heading', { name: 'Getting Started' })).toBeVisible();
    await page.getByRole('heading', { name: 'Support and Contributions' }).click();
    await expect(page.getByRole('heading', { name: 'Support and Contributions' })).toBeVisible();
    await page.getByRole('link', { name: 'Theming' }).click();
    await page.getByRole('link', { name: 'Introduction' }).click();
    await expect(page.getByRole('heading', { name: 'Introduction' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
    await page.getByRole('link', { name: 'Tabs' }).click();
    await expect(page.getByRole('heading', { name: 'Tabs Component' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Simple Tabs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom Tabs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Theme Variables' })).toBeVisible();
    await page.getByRole('button').nth(1).click();
    await page.getByText('Dark', { exact: true }).click();
    await page.getByRole('button').nth(1).click();
    await page.getByText('Light').click();

    expect(errors).toHaveLength(0);
});
