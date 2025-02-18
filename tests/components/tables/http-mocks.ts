import type { Page } from '@playwright/test';
import { Response } from './http-responses.fixture.js';

export async function mockHttpRequests(page: Page) {
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
    await page.route(
        'http://localhost:3000/items/contacts?meta=*&fields=*.*&page=113&limit=10&sort=-id',
        async (route) => {
            await route.fulfill({ body: JSON.stringify(Response.page113) });
        }
    );
}
