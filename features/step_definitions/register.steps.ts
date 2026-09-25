import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TEST_CONFIG } from '../../utils/env';
import { generateUniqueEmail, generateRandomPassword } from '../../utils/testData';

Given('the user is on the registration page', async function (this: CustomWorld) {
  await this.registerPage.goto();
});

When(
  'the user fills the registration form with randomly generated email and password',
  async function (this: CustomWorld) {
    const password = generateRandomPassword();
    await this.registerPage.fillEmail(generateUniqueEmail());
    await this.registerPage.fillPassword(password);
    await this.registerPage.fillConfirmPassword(password);
  }
);

When(
  'the user fills the registration form with the already registered email and a valid password',
  async function (this: CustomWorld) {
    const password = generateRandomPassword();
    await this.registerPage.fillEmail(TEST_CONFIG.userEmail);
    await this.registerPage.fillPassword(password);
    await this.registerPage.fillConfirmPassword(password);
  }
);

When(
  'the user fills the registration form with a random email and the weak password {string}',
  async function (this: CustomWorld, password: string) {
    await this.registerPage.fillEmail(generateUniqueEmail());
    await this.registerPage.fillPassword(password);
    await this.registerPage.fillConfirmPassword(password);
  }
);

When('the user clicks the Create Account button', async function (this: CustomWorld) {
  await this.registerPage.clickRegisterButton();
});

Then('the registration error {string} should be displayed', async function (this: CustomWorld, message: string) {
  await this.registerPage.verifyErrorToast(message);
});

Then('the password field error {string} should be displayed', async function (this: CustomWorld, message: string) {
  await this.registerPage.verifyPasswordError(message);
});

Then('the user should remain on the registration page', async function (this: CustomWorld) {
  await this.registerPage.verifyOnRegisterPage();
});
