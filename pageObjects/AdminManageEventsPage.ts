import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { EventFormData } from '../utils/eventData';

export type AdminEventField = 'title' | 'city' | 'venue' | 'date' | 'price' | 'seats';

export class AdminManageEventsPage extends BasePage {
  readonly adminMenuButton: Locator;
  readonly manageEventsLink: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly cityInput: Locator;
  readonly venueInput: Locator;
  readonly dateInput: Locator;
  readonly priceInput: Locator;
  readonly seatsInput: Locator;
  readonly imageUrlInput: Locator;
  readonly addEventButton: Locator;

  readonly successToast: Locator;
  readonly eventTableRows: Locator;
  readonly totalEventsCount: Locator;

  private readonly fieldErrors: Record<AdminEventField, Locator>;

  constructor(page: Page) {
    super(page);
    this.adminMenuButton = page.getByRole('button', { name: 'Admin' });
    this.manageEventsLink = page.getByRole('navigation').getByRole('link', { name: 'Manage Events' });

    this.titleInput = page.getByTestId('event-title-input');
    this.descriptionInput = page.getByPlaceholder('Describe the event…');
    this.categorySelect = page.locator('#category');
    this.cityInput = page.locator('#city');
    this.venueInput = page.locator('#venue');
    this.dateInput = page.locator('[id="event-date-&-time"]');
    this.priceInput = page.locator('[id="price-($)"]');
    this.seatsInput = page.locator('#total-seats');
    this.imageUrlInput = page.locator('[id="image-url-(optional)"]');
    this.addEventButton = page.getByTestId('add-event-btn');

    this.successToast = page.getByText(/^Event (created|updated|deleted)!?$/);
    this.eventTableRows = page.getByTestId('event-table-row');
    this.totalEventsCount = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: 'All Events' }) })
      .last()
      .locator('span')
      .last();

    this.fieldErrors = {
      title: page.locator('div:has(> [data-testid="event-title-input"]) p'),
      city: page.locator('div:has(> #city) p'),
      venue: page.locator('div:has(> #venue) p'),
      date: page.locator('div:has(> [id="event-date-&-time"]) p'),
      price: page.locator('div:has(> [id="price-($)"]) p'),
      seats: page.locator('div:has(> #total-seats) p'),
    };
  }

  /** Navigates via the nav "Admin" menu, matching how a real admin reaches the page. */
  async open(): Promise<void> {
    await this.adminMenuButton.click();
    await this.manageEventsLink.click();
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  async fillCity(city: string): Promise<void> {
    await this.cityInput.fill(city);
  }

  async fillVenue(venue: string): Promise<void> {
    await this.venueInput.fill(venue);
  }

  async fillDate(date: string): Promise<void> {
    await this.dateInput.fill(date);
  }

  async fillPrice(price: number): Promise<void> {
    await this.priceInput.fill(String(price));
  }

  async fillSeats(seats: number): Promise<void> {
    await this.seatsInput.fill(String(seats));
  }

  async fillImageUrl(imageUrl: string): Promise<void> {
    await this.imageUrlInput.fill(imageUrl);
  }

  /** Fills every field from the given data, optionally skipping one field to trigger its validation error. */
  async fillAllFields(event: EventFormData, options: { skip?: AdminEventField } = {}): Promise<void> {
    if (options.skip !== 'title') await this.fillTitle(event.title);
    await this.fillDescription(event.description);
    await this.selectCategory(event.category);
    if (options.skip !== 'city') await this.fillCity(event.city);
    if (options.skip !== 'venue') await this.fillVenue(event.venue);
    if (options.skip !== 'date') await this.fillDate(event.date);
    if (options.skip !== 'price') await this.fillPrice(event.price);
    if (options.skip !== 'seats') await this.fillSeats(event.seats);
  }

  /** Waits out any still-visible toast from a prior action first, so back-to-back submits don't leave two stacked. */
  async submit(): Promise<void> {
    await this.successToast.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
    await this.addEventButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successToast.first().innerText()).trim();
  }

  async getFieldError(field: AdminEventField): Promise<string> {
    return (await this.fieldErrors[field].innerText()).trim();
  }

  async getTotalEventsCount(): Promise<number> {
    const text = await this.totalEventsCount.innerText();
    const match = text.match(/\d+/);
    if (!match) {
      throw new Error(`Unable to parse a total events count from "${text}"`);
    }
    return parseInt(match[0], 10);
  }
  

  private rowByTitle(title: string): Locator {
    return this.eventTableRows.filter({ hasText: title });
  }

  async verifyEventListed(title: string, category: string, city: string): Promise<void> {
    const row = this.rowByTitle(title);
    await expect(row).toBeVisible();
    await expect(row).toContainText(category);
    await expect(row).toContainText(city);
  }

  async verifyRowListed(title: string): Promise<void> {
    await expect(this.rowByTitle(title)).toBeVisible();
  }

  async verifyRowNotListed(title: string): Promise<void> {
    await expect(this.rowByTitle(title)).toHaveCount(0);
  }

  async verifyRowIsReadOnly(title: string): Promise<void> {
    const row = this.rowByTitle(title);
    await expect(row).toContainText('Read-only');
    await expect(row.getByTestId('edit-event-btn')).toHaveCount(0);
    await expect(row.getByTestId('delete-event-btn')).toHaveCount(0);
  }

  async clickEditForRow(title: string): Promise<void> {
    await this.rowByTitle(title).getByTestId('edit-event-btn').click();
  }

  /** Confirms via the in-page "Delete this event?" dialog, not a native browser confirm. */
  async clickDeleteForRow(title: string): Promise<void> {
    await this.successToast.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
    await this.rowByTitle(title).getByTestId('delete-event-btn').click();
    await this.page.getByRole('button', { name: 'Delete event' }).click();
  }

  /** Test setup helper: clears every user-created event so FIFO-limit tests start from a known baseline. */
  async deleteAllDynamicEvents(): Promise<void> {
    const editableRow = this.eventTableRows.filter({ hasNotText: 'Read-only' });
    while ((await editableRow.count()) > 0) {
      await this.successToast.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
      await editableRow.first().getByTestId('delete-event-btn').click();
      await this.page.getByRole('button', { name: 'Delete event' }).click();
      await this.getSuccessMessage();
    }
  }
}
