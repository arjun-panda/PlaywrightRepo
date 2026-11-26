import { test, expect } from '../../src/fixtures/test.fixture';

test('Two different users can have separate sessions', async ({ userSessions }) => {
  const user1 = await userSessions.create('standard');
  const user2 = await userSessions.create('performance');

  await user1.inventoryPage.expectLoaded();
  await user2.inventoryPage.expectLoaded();

  await user1.inventoryPage.addProductToCart('Sauce Labs Backpack');

  await expect(user1.inventoryPage.cartBadge).toHaveText('1');
  await expect(user2.inventoryPage.cartBadge).toHaveCount(0);
});