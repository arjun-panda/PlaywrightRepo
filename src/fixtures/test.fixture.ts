import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

import { users, type UserKey } from '../config/users';
import { env } from '../config/env';

type UserSession = {
  page: Page;
  context: BrowserContext;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

type UserSessions = {
  create: (userKey: UserKey) => Promise<UserSession>;
};

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  userSessions: UserSessions;
};

// Worker-scoped storage: caches completed states AND tracks in-progress logins
type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

type WorkerFixtures = {
  authCache: {
    states: Map<UserKey, StorageState>;
    inFlight: Map<UserKey, Promise<StorageState>>;
  };
};

export const test = base.extend<AppFixtures, WorkerFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // 1. Lightweight Worker Fixture: initializes empty caches in 0ms
  authCache: [
    async ({}, use) => {
      await use({
        states: new Map<UserKey, StorageState>(),
        inFlight: new Map<UserKey, Promise<StorageState>>(),
      });
    },
    { scope: 'worker' },
  ],

  // 2. Test Fixture: logs in ONLY the specific users requested by the test
  userSessions: async ({ browser, authCache }, use) => {
    const contexts: BrowserContext[] = [];

    // Helper that logs in once per user per worker, even if called concurrently
    const getOrCreateStorageState = async (
      userKey: UserKey
    ): Promise<StorageState> => {
      // Return immediately if already cached in this worker
      const cached = authCache.states.get(userKey);
      if (cached) return cached;

      // Wait for existing login if another call is already logging this user in
      const existingPromise = authCache.inFlight.get(userKey);
      if (existingPromise) return existingPromise;

      // Start a new UI login and store its Promise in the inFlight lock
      const loginPromise = (async () => {
        const setupContext = await browser.newContext({ baseURL: env.baseURL });
        try {
          const setupPage = await setupContext.newPage();
          const loginPage = new LoginPage(setupPage);
          const user = users[userKey];

          await loginPage.login(user.username, user.password);
          await expect(setupPage).toHaveURL(/inventory\.html/, {
            timeout: 30_000,
          });

          const state = await setupContext.storageState();
          authCache.states.set(userKey, state);
          return state;
        } finally {
          await setupContext.close();
          authCache.inFlight.delete(userKey); // Release lock
        }
      })();

      authCache.inFlight.set(userKey, loginPromise);
      return loginPromise;
    };

    const create = async (userKey: UserKey): Promise<UserSession> => {
      // Fetch cached state or perform lazy login on demand
      const storageState = await getOrCreateStorageState(userKey);

      const context = await browser.newContext({
        baseURL: env.baseURL,
        storageState,
      });

      contexts.push(context);
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      await page.goto('/inventory.html');
      await inventoryPage.expectLoaded();

      return {
        page,
        context,
        loginPage,
        inventoryPage,
        cartPage,
      };
    };

    try {
      await use({ create });
    } finally {
      await Promise.all(contexts.map((context) => context.close()));
    }
  },
});

export { expect };
