import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EventDetailPage extends BasePage {
  readonly eventTitle: Locator;
  readonly increaseTicketsButton: Locator;
  readonly ticketCount: Locator;
  readonly customerNameInput: Locator;
  readonly customerEmailInput: Locator;
  readonly phoneInput: Locator;
  readonly totalAmount: Locator;
  readonly confirmBookingButton: Locator;
  readonly bookingRef: Locator;
  readonly viewMyBookingsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.eventTitle = page.getByRole('heading', { level: 1 });
    this.increaseTicketsButton = page.getByRole('button', { name: '+', exact: true });
    this.ticketCount = page.locator('#ticket-count');
    this.customerNameInput = page.locator('#customerName');
    this.customerEmailInput = page.locator('#customer-email');
    this.phoneInput = page.locator('#phone');
    // The "Total" row in the price summary box: a div containing a "Total" label span and an amount span.
    this.totalAmount = page
      .locator('div')
      .filter({ has: page.locator('span', { hasText: /^Total$/ }) })
      .last()
      .locator('span')
      .last();
    this.confirmBookingButton = page.locator('#confirm-booking');
    this.bookingRef = page.locator('.booking-ref');
    this.viewMyBookingsLink = page.getByRole('link', { name: 'View My Bookings' });
  }

  /** Finds the value paragraph next to a field label paragraph, e.g. "City", "About this event". */
  private detailValue(label: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .last()
      .locator('p')
      .last();
  }

  async verifyEventNameVisible(eventName: string): Promise<void> {
    await expect(this.eventTitle).toHaveText(eventName);
  }

  async verifyCategory(category: string): Promise<void> {
    await expect(this.page.getByText(category, { exact: true })).toBeVisible();
  }

  async verifyCity(city: string): Promise<void> {
    await expect(this.detailValue('City')).toHaveText(city);
  }

  async verifyDescription(description: string): Promise<void> {
    await expect(this.detailValue('About this event')).toHaveText(description);
  }

  async setTicketCount(count: number): Promise<void> {
    const current = parseInt((await this.ticketCount.innerText()).trim(), 10);
    for (let i = current; i < count; i++) {
      await this.increaseTicketsButton.click();
    }
  }

  async fillCustomerDetails(name: string, email: string, phone: string): Promise<void> {
    await this.customerNameInput.fill(name);
    await this.customerEmailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.totalAmount.innerText();
    return this.parsePrice(text);
  }

  async clickConfirmBooking(): Promise<void> {
    await this.confirmBookingButton.click();
  }

  /** The confirmation heading includes a trailing emoji, so this matches the given text as a partial, case-sensitive substring. */
  async verifyBookingConfirmed(message: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: new RegExp(this.escapeForRegExp(message)) })).toBeVisible();
  }

  async getBookingReference(): Promise<string> {
    const ref = await this.bookingRef.innerText();
    return ref.trim();
  }

  async clickViewMyBookings(): Promise<void> {
    await this.viewMyBookingsLink.click();
  }
}
