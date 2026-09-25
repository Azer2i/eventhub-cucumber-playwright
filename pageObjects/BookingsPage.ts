import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_CONFIG } from '../utils/env';

export class BookingsPage extends BasePage {
  readonly bookingCards: Locator;

  constructor(page: Page) {
    super(page);
    this.bookingCards = page.locator('[data-testid="booking-card"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/bookings`);
  }

  /** Finds the booking card matching an exact booking reference, since several bookings for the same event may be listed. */
  private cardByReference(reference: string): Locator {
    return this.bookingCards.filter({ has: this.page.locator('.booking-ref', { hasText: reference }) });
  }

  async verifyBookingListed(reference: string): Promise<void> {
    await expect(this.cardByReference(reference)).toBeVisible();
  }

  async openBookingDetails(reference: string): Promise<void> {
    await this.cardByReference(reference).getByRole('link', { name: 'View Details' }).click();
  }
}
