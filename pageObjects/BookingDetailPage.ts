import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookingDetailPage extends BasePage {
  readonly eventTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.eventTitle = page.getByRole('heading', { level: 1 });
  }

  /** Finds the value span next to a field label span, e.g. "Name", "Email", "Total Paid". */
  private fieldValue(label: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .last()
      .locator('span')
      .last();
  }

  async verifyEventName(eventName: string): Promise<void> {
    await expect(this.eventTitle).toHaveText(eventName);
  }

  async verifyCustomerDetails(name: string, email: string, phone: string): Promise<void> {
    await expect(this.fieldValue('Name')).toHaveText(name);
    await expect(this.fieldValue('Email')).toHaveText(email);
    await expect(this.fieldValue('Phone')).toHaveText(phone);
  }

  async getTotalPaid(): Promise<number> {
    const text = await this.fieldValue('Total Paid').innerText();
    return this.parsePrice(text);
  }
}
