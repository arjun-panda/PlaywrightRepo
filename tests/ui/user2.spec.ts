import { test, expect } from '../../src/fixtures/test.fixture';

test('Problem user can login', async ({ userSessions }) => {

  const user2 = await userSessions.create('problem');

  await expect(user2.page).toHaveURL(/inventory.html/);
});