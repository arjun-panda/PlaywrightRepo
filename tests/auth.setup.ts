
import { test as setup, expect } from '@playwright/test';
import { env } from '../src/config/env';

setup('authenticate standard user', async ({ page }) => {

  await page.goto('/');

  // Print username only. Never print the password.
  console.log('Login username:', env.username);

  await page.getByPlaceholder('Username').fill(env.username);
  await page.getByPlaceholder('Password').fill(env.password);

  await page.getByRole('button', {
    name: 'Login',
    exact: true
  }).click();

  // Check whether SauceDemo displayed a login error
  const errorMessage = page.locator('[data-test="error"]');

  if (await errorMessage.isVisible()) {
    console.log(
      'LOGIN ERROR:',
      await errorMessage.innerText()
    );
  }

  // Verify successful login
  await expect(page).toHaveURL(/inventory\.html/);

  await expect(
    page.getByText('Products', { exact: true })
  ).toBeVisible();

  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });
});
