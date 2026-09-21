import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { HomePage } from '../../pageObjects/HomePage';
import { RegisterPage } from '../../pageObjects/RegisterPage';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  homePage!: HomePage;
  registerPage!: RegisterPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPageObjects(): void {
    this.loginPage = new LoginPage(this.page);
    this.homePage = new HomePage(this.page);
    this.registerPage = new RegisterPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
