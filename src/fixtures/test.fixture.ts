
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

import { users, type UserKey } from '../config/users';
import { env } from '../config/env';

// A single logged-in user's session
type UserSession = {
  page: Page;
  context: BrowserContext;
};

// A fixture that can create sessions for different users
type UserSessions = {
  create: (userKey: UserKey) => Promise<UserSession>;
};

// All custom fixtures used by the framework
type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  userSessions: UserSessions;
};

export const test = base.extend<AppFixtures>({

  // Existing Page Object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // Multi-user session fixture
  userSessions: async ({ browser }, use) => {

    // Keep track of every context created during this test
    const contexts: BrowserContext[] = [];

    // Create a logged-in session for the requested user
    const create = async (
      userKey: UserKey
    ): Promise<UserSession> => {

      // Get credentials from users.ts
      const selectedUser = users[userKey];

      // Create an isolated browser context
      const context = await browser.newContext({baseURL: env.baseURL});

      // Track it so we can close it later
      contexts.push(context);

      // Create a separate page for this user
      const page = await context.newPage();

      // Create the LoginPage object
      const loginPage = new LoginPage(page);

      // Login using the selected user's credentials
      await loginPage.login(
        selectedUser.username,
        selectedUser.password
      );

      // Return this user's logged-in session
      return { page, context };
    };

    // Expose the create function to test cases
    await use({ create });

    // Cleanup: close every context created by this fixture
    await Promise.all(
      contexts.map(context => context.close())
    );
  },
});

export { expect };
