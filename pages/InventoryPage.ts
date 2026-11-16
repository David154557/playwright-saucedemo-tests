import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Product name -> data-test slug, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack" */
  private slug(productName: string) {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  async addToCart(productName: string) {
    await this.page.getByTestId(`add-to-cart-${this.slug(productName)}`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
