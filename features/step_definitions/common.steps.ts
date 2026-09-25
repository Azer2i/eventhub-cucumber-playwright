import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TEST_CONFIG } from '../../utils/env';

Given('the user is logged in', async function (this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.enterEmail(TEST_CONFIG.userEmail);
  await this.loginPage.enterPassword(TEST_CONFIG.userPassword);
  await this.loginPage.clickSignInButton();
  await this.homePage.verifyOnHomePage();
});
