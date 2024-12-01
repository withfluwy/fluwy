import { test, expect } from '@playwright/test';
import { Response } from './http-responses.fixture.js';
import { checkScreenshot } from '../../utils.js';

test('table component', async ({ page }) => {
    await page.route(
        'http://localhost:3000/items/contacts?meta=*&fields=*.*&page=1&limit=10&sort=-id',
        async (route) => {
            await route.fulfill({ body: JSON.stringify(Response.page1) });
        }
    );
    await page.route(
        'http://localhost:3000/items/contacts?meta=*&fields=*.*&page=2&limit=10&sort=-id',
        async (route) => {
            await route.fulfill({ body: JSON.stringify(Response.page2) });
        }
    );

    await page.goto('/components/tables/tests');

    await expect(page.getByRole('cell', { name: 'Zaccaria Padfield' })).toBeVisible();
    page.once('dialog', (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('cell', { name: 'Ivy Melloi' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByRole('cell', { name: 'Rochester Catherall' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Bibbye Tonkinson' })).toBeVisible();
    await page.getByRole('button', { name: 'Previous' }).click();

    await checkScreenshot(page);
});

test('table component in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.route(
        'http://localhost:3000/items/contacts?meta=*&fields=*.*&page=1&limit=10&sort=-id',
        async (route) => {
            await route.fulfill({ body: JSON.stringify(Response.page1) });
        }
    );

    await page.goto('/components/tables/tests');

    await checkScreenshot(page);
});
