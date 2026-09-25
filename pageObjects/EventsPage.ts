import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_CONFIG } from '../utils/env';

export class EventsPage extends BasePage {
  readonly eventCards: Locator;
  readonly featuredEventCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.eventCards = page.locator('[data-testid="event-card"]');
    this.featuredEventCards = this.eventCards.filter({ hasText: 'Featured' });
    this.searchInput = page.getByPlaceholder('Search events, venues…');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/events`);
  }

  private firstFeaturedCard(): Locator {
    return this.featuredEventCards.first();
  }

  async getFirstFeaturedEventName(): Promise<string> {
    const name = await this.firstFeaturedCard().locator('h3').innerText();
    return name.trim();
  }

  async getFirstFeaturedEventPrice(): Promise<number> {
    const priceText = await this.firstFeaturedCard()
      .locator('p')
      .filter({ hasText: /^\$/ })
      .innerText();
    return this.parsePrice(priceText);
  }

  async clickBookNowOnFirstFeaturedEvent(): Promise<void> {
    await this.firstFeaturedCard().locator('[data-testid="book-now-btn"]').click();
  }

  async searchByTitle(title: string): Promise<void> {
    await this.searchInput.fill(title);
  }

  /**
   * Opens the event detail page by clicking a card's title link, since the search is expected to return a single
   * match. A newly created event can briefly 404 on its detail page right after creation (backend replication lag),
   * which bounces back to this search results page, so the click is retried until the URL actually advances.
   */
  async openEventByTitle(title: string): Promise<void> {
    const heading = this.eventCards.filter({ hasText: title }).getByRole('heading', { name: title });

    await expect(async () => {
      if (!/\/events\/\d+/.test(this.page.url())) {
        await this.searchByTitle(title);
      }
      await heading.click();
      await expect(this.page).toHaveURL(/\/events\/\d+/, { timeout: 2000 });
    }).toPass({ timeout: 15000 });
  }
}
