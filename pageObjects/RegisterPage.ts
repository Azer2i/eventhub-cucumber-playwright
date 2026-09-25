import { Page, Locator, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/env';

export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('register-email');
    this.passwordInput = page.getByTestId('register-password');
    this.confirmPasswordInput = page.getByPlaceholder('Repeat your password');
    this.registerButton = page.getByTestId('register-btn');
    this.passwordError = page.locator('div:has(> #register-password) p');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/register`);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async verifyOnRegisterPage(): Promise<void> {
    await expect(this.page).toHaveURL(`${TEST_CONFIG.baseUrl}/register`);
  }

  async verifyHeadingVisible(headingText: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
  }

  async verifyPasswordError(message: string): Promise<void> {
    await expect(this.passwordError).toHaveText(message);
  }

  /** The error banner is a toast that auto-dismisses, so this relies on Playwright's auto-waiting instead of a fixed delay. */
  async verifyErrorToast(message: string): Promise<void> {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }
}
