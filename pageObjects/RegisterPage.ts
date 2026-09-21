import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/env';

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyOnRegisterPage(): Promise<void> {
    await expect(this.page).toHaveURL(`${TEST_CONFIG.baseUrl}/register`);
  }

  async verifyHeadingVisible(headingText: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
  }
}
