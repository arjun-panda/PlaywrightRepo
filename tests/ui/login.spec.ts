import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { users } from '../../src/config/users';

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows an error for an invalid password @smoke', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(users.standard.username);
    await page.getByPlaceholder('Password').fill(randomUUID());
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match',
    );
  });
});
