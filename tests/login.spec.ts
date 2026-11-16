import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.inventoryItems).toHaveCount(6);
  });

  test('login fails with wrong password', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('locked out user sees an error', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).not.toHaveURL(/inventory/);
  });
});
