import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cart and checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('add product to cart and complete checkout', async ({ page }) => {
    const product = 'Sauce Labs Backpack';
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addToCart(product);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cart.cartItems).toHaveCount(1);
    await expect(cart.itemNames).toHaveText(product);

    await cart.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    await checkout.fillInformation('Test', 'User', '12345');
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkout.itemNames).toHaveText(product);
    await expect(checkout.subtotal).toHaveText('Item total: $29.99');
    await expect(checkout.tax).toHaveText('Tax: $2.40');
    await expect(checkout.total).toHaveText('Total: $32.39');

    await checkout.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventory.cartBadge).toBeHidden();
  });
});
