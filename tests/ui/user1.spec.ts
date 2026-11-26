import { test } from '../../src/fixtures/test.fixture';

test('Standard user gets an authenticated session', async ({ userSessions }) => {
  const user1 = await userSessions.create('standard');
  await user1.inventoryPage.expectLoaded();
});