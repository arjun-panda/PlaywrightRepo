import { test, expect } from '../../src/fixtures/test.fixture';

test('Problem user gets an authenticated session', async ({ userSessions }) => {
  const user2 = await userSessions.create('problem');
  await user2.inventoryPage.expectLoaded();
  await user2.inventoryPage.openCart();
  await expect(user2.cartPage.cartItems).toHaveCount(0);
});