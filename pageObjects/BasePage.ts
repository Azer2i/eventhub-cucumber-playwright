import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Strips a leading "$" and thousands separators, then converts the remaining text to a number. */
  protected parsePrice(text: string): number {
    const match = text.replace(/,/g, '').match(/\$?\s*([0-9]+(?:\.[0-9]{1,2})?)/);
    if (!match) {
      throw new Error(`Unable to parse a price from "${text}"`);
    }
    return parseFloat(match[1]);
  }

  /** Escapes regex special characters so arbitrary text can be used as a literal, partial-match pattern. */
  protected escapeForRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
