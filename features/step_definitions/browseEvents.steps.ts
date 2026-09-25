import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('the user searches for {string}', async function (this: CustomWorld, query: string) {
  await this.eventsPage.searchByTitle(query);
});

When('the user filters by category {string}', async function (this: CustomWorld, category: string) {
  await this.eventsPage.selectCategory(category);
});

When('the user filters by city {string}', async function (this: CustomWorld, city: string) {
  await this.eventsPage.selectCity(city);
});

When('the user clicks the Clear filters button', async function (this: CustomWorld) {
  await this.eventsPage.clickClearFilters();
});

Then('only the {string} event should be visible', async function (this: CustomWorld, title: string) {
  await this.eventsPage.verifyOnlyMatchingCardVisible(title);
});

Then('no events should be found', async function (this: CustomWorld) {
  await this.eventsPage.verifyNoEventsFoundMessage();
});

Then('every visible event card should contain {string}', async function (this: CustomWorld, text: string) {
  await this.eventsPage.verifyAllVisibleCardsContainText(text);
});

Then('the search field should be empty', async function (this: CustomWorld) {
  await this.eventsPage.verifySearchInputCleared();
});

Then('at least one event card should be visible', async function (this: CustomWorld) {
  await this.eventsPage.verifyAtLeastOneEventCardVisible();
});
