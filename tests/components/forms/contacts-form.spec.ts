import { expect, test } from '@playwright/test';
import { ValidationErrorsResponse } from './contacts-form.fixtures.js';
import { sleep } from '@/lib/core/utils/index.js';

test('create contacts with button.on_click event', async ({ page }) => {
    await page.route('http://localhost:3000/api/contacts', async (route) => {
        if (route.request().method() !== 'POST') throw new Error('Unexpected request');

        await route.fulfill({
            status: 400,
            json: ValidationErrorsResponse,
        });
    });

    await page.goto('/components/forms/tests');
    await expect(page.getByText('Contact Form - Button SubmitFirst Name Last')).toBeVisible();
    await page.getByRole('button', { name: 'Create Contact' }).nth(0).click();
    await expect(page.getByText('This field is required.').first()).toBeVisible();
    await page.getByText('This field is required.').nth(1).click();
    await page.getByText('Please enter a valid email').click();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Button Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: This field is required. Last Name
        - textbox "Last Name"
        - text: This field is required. Email Address
        - textbox "Email Address"
        - text: Please enter a valid email address.
        - button "Clear errors"
        - button "Create Contact":
          - img
        `);

    await page.getByRole('button', { name: 'Clear errors' }).nth(0).click();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Button Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: Last Name
        - textbox "Last Name"
        - text: Email Address
        - textbox "Email Address"
        - button "Clear errors"
        - button "Create Contact":
          - img
    `);
});

test('create contact with button.on_click on slow connection', async ({ page }) => {
    await page.route('http://localhost:3000/api/contacts', async (route) => {
        if (route.request().method() !== 'POST') throw new Error('Unexpected request');

        await sleep(500);

        await route.fulfill({
            status: 400,
            json: ValidationErrorsResponse,
        });
    });

    await page.goto('/components/forms/tests');

    const createButton = page.getByRole('button', { name: 'Create Contact' }).nth(0);

    await expect(createButton).toBeVisible();
    await createButton.click();

    const loader = createButton.locator('iconify-icon[icon="svg-spinners:90-ring-with-bg"]');
    await expect(loader).toBeVisible();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Button Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: This field is required. Last Name
        - textbox "Last Name"
        - text: This field is required. Email Address
        - textbox "Email Address"
        - text: Please enter a valid email address.
        - button "Clear errors"
        - button "Create Contact":
          - img
    `);

    await expect(loader).not.toBeVisible();
});

test('create contact from on_submit on forms', async ({ page }) => {
    await page.route('http://localhost:3000/api/contacts', async (route) => {
        if (route.request().method() !== 'POST') throw new Error('Unexpected request');

        await route.fulfill({
            status: 400,
            json: ValidationErrorsResponse,
        });
    });

    await page.goto('/components/forms/tests');
    await expect(page.getByText('Contact Form - Form SubmitFirst Name Last')).toBeVisible();
    await page.getByRole('button', { name: 'Create Contact' }).nth(1).click();

    await expect(page.getByText('This field is required.').first()).toBeVisible();
    await page.getByText('This field is required.').nth(1).click();
    await page.getByText('Please enter a valid email').click();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Form Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: This field is required. Last Name
        - textbox "Last Name"
        - text: This field is required. Email Address
        - textbox "Email Address"
        - text: Please enter a valid email address.
        - button "Clear errors"
        - button "Create Contact":
          - img
    `);

    await page.getByRole('button', { name: 'Clear errors' }).nth(1).click();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Form Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: Last Name
        - textbox "Last Name"
        - text: Email Address
        - textbox "Email Address"
        - button "Clear errors"
        - button "Create Contact":
          - img
    `);
});

test('create contact from on_submit on forms on slow connection', async ({ page }) => {
    await page.route('http://localhost:3000/api/contacts', async (route) => {
        if (route.request().method() !== 'POST') throw new Error('Unexpected request');

        await sleep(500);

        await route.fulfill({
            status: 400,
            json: ValidationErrorsResponse,
        });
    });

    await page.goto('/components/forms/tests');

    const createButton = page.getByRole('button', { name: 'Create Contact' }).nth(1);

    await expect(createButton).toBeVisible();
    await createButton.click();

    const loader = createButton.locator('iconify-icon[icon="svg-spinners:90-ring-with-bg"]');
    await expect(loader).toBeVisible();

    await expect(page.locator('#main')).toMatchAriaSnapshot(`
        - heading "Contact Form - Form Submit" [level=5]
        - text: First Name
        - textbox "First Name"
        - text: This field is required. Last Name
        - textbox "Last Name"
        - text: This field is required. Email Address
        - textbox "Email Address"
        - text: Please enter a valid email address.
        - button "Clear errors"
        - button "Create Contact":
            - img
    `);

    await expect(loader).not.toBeVisible();
});

test('contacts form with nested data', async ({ page }) => {
    await page.goto('/components/forms/tests');

    await test.step('check form initial data', async () => {
        await expect(page.locator('#main')).toMatchAriaSnapshot(`
            - heading "Contact Form - Nested Data" [level=5]
            - textbox "Email Address"
            - text: Address
            - textbox "Address": /\\d+ Main St/
            - textbox "City": London
            - textbox "Country"
            - button "Submit":
                - img
            - text: "/\\\\{ \\"firstName\\": \\"John\\", \\"lastName\\": \\"Doe\\", \\"email\\": \\"john\\\\.doe\\", \\"address\\": \\\\{ \\"line1\\": \\"\\\\d+ Main St\\", \\"city\\": \\"London\\", \\"country\\": \\"UK\\" \\\\} \\\\}/"
        `);
    });

    await test.step('change email and address', async () => {
        await page.getByPlaceholder('Email Address').click();
        await page.getByPlaceholder('Email Address').fill('john.doe@mail.com');
        await page.getByPlaceholder('Address Line').click();
        await page.getByPlaceholder('Address Line').press('ControlOrMeta+a');
        await page.getByPlaceholder('Address Line').fill('255 156 St');
        await page.getByPlaceholder('Country').dblclick();
        await page.getByPlaceholder('Country').fill('CA');

        await expect(page.locator('#main')).toMatchAriaSnapshot(`
            - heading "Contact Form - Nested Data" [level=5]
            - textbox "Email Address": john.doe@mail.com
            - text: Address
            - textbox "Address": /\\d+ \\d+ St/
            - textbox "City": London
            - textbox "Country"
            - button "Submit":
                - img
            - text: "/\\\\{ \\"firstName\\": \\"John\\", \\"lastName\\": \\"Doe\\", \\"email\\": \\"john\\\\.doe@mail\\\\.com\\", \\"address\\": \\\\{ \\"line1\\": \\"\\\\d+ \\\\d+ St\\", \\"city\\": \\"London\\", \\"country\\": \\"CA\\" \\\\} \\\\}/"
        `);
    });

    await test.step('check validation errors', async () => {
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.locator('#main')).toMatchAriaSnapshot(`
            - heading "Contact Form - Nested Data" [level=5]
            - textbox "Email Address": john.doe@mail.com
            - text: Email is required Address
            - textbox "Address": /\\d+ \\d+ St/
            - text: Address line 1 is required
            - textbox "City": London
            - text: City is required
            - textbox "Country"
            - text: Country is required
            - button "Submit":
                - img
            - text: "/\\\\{ \\"firstName\\": \\"John\\", \\"lastName\\": \\"Doe\\", \\"email\\": \\"john\\\\.doe@mail\\\\.com\\", \\"address\\": \\\\{ \\"line1\\": \\"\\\\d+ \\\\d+ St\\", \\"city\\": \\"London\\", \\"country\\": \\"CA\\" \\\\} \\\\}/"
        `);
    });
});
