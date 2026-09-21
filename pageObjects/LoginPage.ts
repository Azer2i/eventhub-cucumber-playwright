import { Page, Locator, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/env';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;
  readonly emailFieldError: Locator;
  readonly passwordFieldError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#login-btn');
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.emailFieldError = page.locator('div:has(> #email) p');
    this.passwordFieldError = page.locator('div:has(> #password) p');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/login`);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  async verifyOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(`${TEST_CONFIG.baseUrl}/login`);
  }

  /** The "Invalid email or password" banner is a toast that auto-dismisses, so this relies on Playwright's auto-waiting instead of a fixed delay. */
  async verifyInvalidCredentialsError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async verifyEmailFieldError(message: string): Promise<void> {
    await expect(this.emailFieldError).toHaveText(message);
  }

  async verifyPasswordFieldError(message: string): Promise<void> {
    await expect(this.passwordFieldError).toHaveText(message);
  }
}
