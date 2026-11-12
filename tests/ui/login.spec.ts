import { test, expect } from '@playwright/test';
import { env } from '../../src/config/env';

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows an error for an invalid password @smoke', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(env.username);
    await page.getByPlaceholder('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match',
    );
  });
});
