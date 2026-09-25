import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { HomePage } from '../../pageObjects/HomePage';
import { RegisterPage } from '../../pageObjects/RegisterPage';
import { EventsPage } from '../../pageObjects/EventsPage';
import { EventDetailPage } from '../../pageObjects/EventDetailPage';
import { BookingsPage } from '../../pageObjects/BookingsPage';
import { BookingDetailPage } from '../../pageObjects/BookingDetailPage';
import { AdminManageEventsPage } from '../../pageObjects/AdminManageEventsPage';
import { EventFormData } from '../../utils/eventData';

export interface BookingContext {
  eventName: string;
  ticketPrice: number;
  ticketCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingReference: string;
}

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  homePage!: HomePage;
  registerPage!: RegisterPage;
  eventsPage!: EventsPage;
  eventDetailPage!: EventDetailPage;
  bookingsPage!: BookingsPage;
  bookingDetailPage!: BookingDetailPage;
  adminManageEventsPage!: AdminManageEventsPage;

  bookingContext: Partial<BookingContext> = {};
  eventContext: Partial<EventFormData> = {};
  totalEventsBeforeSubmit?: number;
  eventTitlesCreated: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPageObjects(): void {
    this.loginPage = new LoginPage(this.page);
    this.homePage = new HomePage(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.eventsPage = new EventsPage(this.page);
    this.eventDetailPage = new EventDetailPage(this.page);
    this.bookingsPage = new BookingsPage(this.page);
    this.bookingDetailPage = new BookingDetailPage(this.page);
    this.adminManageEventsPage = new AdminManageEventsPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
