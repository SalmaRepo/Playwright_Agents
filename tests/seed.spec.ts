
import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Tests', () => {

  test('1.1 - Successful login with valid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('1.2 - Locked-out user should see an error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]'))
      .toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('2.1 - Add a product to the cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText('1');

    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Sauce Labs Backpack', { exact: true })
    ).toBeVisible();

    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('3.1 - Sort products by price from low to high', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const products = page.locator('.inventory_item');

    await expect(products.first()).toContainText('Sauce Labs Onesie');
    await expect(products.first()).toContainText('$7.99');

    await expect(products.last()).toContainText('Sauce Labs Fleece Jacket');
    await expect(products.last()).toContainText('$49.99');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(price => Number(price.replace('$', '')));

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('4.1 - Complete a purchase successfully', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.locator('[data-test="firstName"]').fill('Salma');
    await page.locator('[data-test="lastName"]').fill('Test');
    await page.locator('[data-test="postalCode"]').fill('500001');

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(
      page.getByText('Checkout: Overview', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Sauce Labs Backpack', { exact: true })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(
      page.getByText('Thank you for your order!', { exact: true })
    ).toBeVisible();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveCount(0);
  });

});

