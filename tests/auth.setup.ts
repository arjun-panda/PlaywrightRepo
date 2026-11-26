
import { test as setup, expect } from '@playwright/test';
import { users } from '../src/config/users';

setup('authenticate standard user', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(users.standard.username);
  await page.getByPlaceholder('Password').fill(users.standard.password);

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
