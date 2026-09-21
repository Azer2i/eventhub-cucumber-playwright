import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TEST_CONFIG } from '../../utils/env';

Given('the user is on the login page', async function (this: CustomWorld) {
  await this.loginPage.goto();
});

When('the user enters a valid email and password', async function (this: CustomWorld) {
  await this.loginPage.enterEmail(TEST_CONFIG.userEmail);
  await this.loginPage.enterPassword(TEST_CONFIG.userPassword);
});

When(
  'the user enters the non-existent email {string} and a valid password',
  async function (this: CustomWorld, email: string) {
    await this.loginPage.enterEmail(email);
    await this.loginPage.enterPassword(TEST_CONFIG.userPassword);
  }
);

When('the user enters the email {string} and a valid password', async function (this: CustomWorld, email: string) {
  await this.loginPage.enterEmail(email);
  await this.loginPage.enterPassword(TEST_CONFIG.userPassword);
});

When('the user leaves the email field empty and enters a valid password', async function (this: CustomWorld) {
  await this.loginPage.enterPassword(TEST_CONFIG.userPassword);
});

When('the user enters a valid email and leaves the password field empty', async function (this: CustomWorld) {
  await this.loginPage.enterEmail(TEST_CONFIG.userEmail);
});

When(
  'the user enters a valid email and the password {string}',
  async function (this: CustomWorld, password: string) {
    await this.loginPage.enterEmail(TEST_CONFIG.userEmail);
    await this.loginPage.enterPassword(password);
  }
);

When('the user clicks the Sign In button', async function (this: CustomWorld) {
  await this.loginPage.clickSignInButton();
});

When('the user clicks the Register link', async function (this: CustomWorld) {
  await this.loginPage.clickRegisterLink();
});

Then('the user should be redirected to the home page', async function (this: CustomWorld) {
  await this.homePage.verifyOnHomePage();
});

Then('the user should be redirected to the registration page', async function (this: CustomWorld) {
  await this.registerPage.verifyOnRegisterPage();
});

Then('the {string} heading should be visible', async function (this: CustomWorld, headingText: string) {
  if (this.page.url().includes('/register')) {
    await this.registerPage.verifyHeadingVisible(headingText);
  } else {
    await this.homePage.verifyHeadingVisible(headingText);
  }
});

Then('the error message {string} should be displayed', async function (this: CustomWorld, message: string) {
  await this.loginPage.verifyInvalidCredentialsError(message);
});

Then(
  'the error {string} should be displayed below the email field',
  async function (this: CustomWorld, message: string) {
    await this.loginPage.verifyEmailFieldError(message);
  }
);

Then(
  'the error {string} should be displayed below the password field',
  async function (this: CustomWorld, message: string) {
    await this.loginPage.verifyPasswordFieldError(message);
  }
);

Then('the user should remain on the login page', async function (this: CustomWorld) {
  await this.loginPage.verifyOnLoginPage();
});
