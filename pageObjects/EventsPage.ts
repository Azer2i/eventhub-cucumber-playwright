import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_CONFIG } from '../utils/env';

export class EventsPage extends BasePage {
  readonly eventCards: Locator;
  readonly featuredEventCards: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly citySelect: Locator;
  readonly clearFiltersButton: Locator;
  readonly noEventsFoundHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.eventCards = page.locator('[data-testid="event-card"]');
    this.featuredEventCards = this.eventCards.filter({ hasText: 'Featured' });
    this.searchInput = page.getByPlaceholder('Search events, venues…');
    this.categorySelect = page.getByRole('combobox').filter({ hasText: 'All Categories' });
    this.citySelect = page.getByRole('combobox').filter({ hasText: 'All Cities' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear filters' });
    this.noEventsFoundHeading = page.getByRole('heading', { name: 'No events found' });
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

  /**
   * Each filter's change is pushed to the URL on its own debounce timer. Changing a second filter before the first
   * one's debounce settles can race and drop the earlier filter from the URL entirely, so every filter setter here
   * waits for its own query param to land before returning, keeping filters composable regardless of call order.
   */
  private async waitForQueryParam(param: string, value: string): Promise<void> {
    await expect(async () => {
      const actual = await this.page.evaluate((p) => new URLSearchParams(window.location.search).get(p), param);
      expect(actual).toBe(value);
    }).toPass({ timeout: 5000 });
  }

  async searchByTitle(title: string): Promise<void> {
    await this.searchInput.fill(title);
    await this.waitForQueryParam('search', title);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
    await this.waitForQueryParam('category', category);
  }

  async selectCity(city: string): Promise<void> {
    await this.citySelect.selectOption(city);
    await this.waitForQueryParam('city', city);
  }

  async clickClearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }

  async getVisibleEventCount(): Promise<number> {
    return this.eventCards.count();
  }

  async verifyNoEventsFoundMessage(): Promise<void> {
    await expect(this.noEventsFoundHeading).toBeVisible({ timeout: 10000 });
  }

  async verifySearchInputCleared(): Promise<void> {
    await expect(this.searchInput).toHaveValue('');
  }

  /** Confirms the search/filters narrowed the grid down to exactly this one card, not just that it's present among others. */
  async verifyOnlyMatchingCardVisible(title: string): Promise<void> {
    await expect(this.eventCards.filter({ hasText: title })).toHaveCount(1);
    await expect(this.eventCards).toHaveCount(1);
  }

  /**
   * The filter dropdowns trigger a debounced, real backend fetch, so a single count() read can catch the grid
   * mid-refresh; this retries the whole count-and-check block until it settles on a consistent result.
   */
  async verifyAllVisibleCardsContainText(text: string): Promise<void> {
    await expect(async () => {
      await expect(this.eventCards.first()).toBeVisible({ timeout: 1000 });
      const count = await this.eventCards.count();
      for (let i = 0; i < count; i++) {
        await expect(this.eventCards.nth(i)).toContainText(text, { timeout: 1000 });
      }
    }).toPass({ timeout: 10000 });
  }

  /** Waits for the filtered/cleared grid to actually render, since a bare count() read doesn't wait out the search debounce. */
  async verifyAtLeastOneEventCardVisible(): Promise<void> {
    await expect(this.eventCards.first()).toBeVisible();
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
