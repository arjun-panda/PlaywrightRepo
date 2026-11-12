import { test as setup, expect } from '@playwright/test';
import { env } from '../src/config/env';

const authFile = 'playwright/.auth/user.json';

setup('authenticate standard user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(env.username);
  await page.getByPlaceholder('Password').fill(env.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
