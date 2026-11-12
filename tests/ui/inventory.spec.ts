import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    // storageState restores authentication, but does not restore the previous URL.
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('displays all available products @smoke', async ({ inventoryPage }) => {
    await inventoryPage.expectProductCount(6);
  });

  test('sorts products by price from low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const numericPrices = await inventoryPage.getProductPrices();
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
  });

  test('adds a product to the shopping cart', async ({ inventoryPage, cartPage }) => {
    const productName = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(productName);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await cartPage.expectProductInCart(productName);
  });
});
