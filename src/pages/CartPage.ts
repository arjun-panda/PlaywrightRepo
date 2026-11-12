import { type Locator, type Page, expect } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  async expectProductInCart(productName: string): Promise<void> {
    const product = this.cartItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
    await expect(product).toHaveCount(1);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
