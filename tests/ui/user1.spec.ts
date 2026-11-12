import { test, expect } from '../../src/fixtures/test.fixture';

test('Standard user can login', async ({ userSessions }) => {

  const user1 = await userSessions.create('standard');

  await expect(user1.page).toHaveURL(/inventory.html/);

  await expect(
    user1.page.getByText('Products', { exact: true })
  ).toBeVisible();
});