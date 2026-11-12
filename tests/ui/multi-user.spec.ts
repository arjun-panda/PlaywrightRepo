import { test, expect } from '../../src/fixtures/test.fixture';

test('Two different users can have separate sessions',
  async ({ userSessions }) => {

    // Login as standard user
    const user1 = await userSessions.create('standard');

    // Login as performance user
    const user2 = await userSessions.create('performance');

    // Verify User 1 is logged in
    await expect(user1.page).toHaveURL(/inventory.html/);

    // Verify User 2 is logged in
    await expect(user2.page).toHaveURL(/inventory.html/);

    // Verify both have their own pages
    await expect(
      user1.page.getByText('Products', { exact: true })
    ).toBeVisible();

    await expect(
      user2.page.getByText('Products', { exact: true })
    ).toBeVisible();
  }
);