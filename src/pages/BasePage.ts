import { type Locator, type Page, expect } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async expectLoaded(expectedURL: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }
}
