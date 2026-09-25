import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { generateEventData, EventFormData } from '../../utils/eventData';
import { AdminEventField } from '../../pageObjects/AdminManageEventsPage';

When('the user opens the Admin Manage Events page', async function (this: CustomWorld) {
  await this.adminManageEventsPage.open();
});

When('the user fills the event form with randomly generated event data', async function (this: CustomWorld) {
  const eventData = generateEventData();
  this.eventContext = eventData;
  this.log(`Generated event: "${eventData.title}" (${eventData.category}, ${eventData.city})`);
  await this.adminManageEventsPage.fillAllFields(eventData);
});

When(
  'the user fills the event form with randomly generated data, leaving the {string} field empty',
  async function (this: CustomWorld, field: string) {
    const eventData = generateEventData();
    this.eventContext = eventData;
    await this.adminManageEventsPage.fillAllFields(eventData, { skip: field as AdminEventField });
  }
);

When('the user submits the event form', async function (this: CustomWorld) {
  await this.adminManageEventsPage.submit();
});

Then('the success message {string} should be displayed', async function (this: CustomWorld, message: string) {
  const actual = await this.adminManageEventsPage.getSuccessMessage();
  expect(actual).toBe(message);
});

Then(
  'the {string} field should show the error {string}',
  async function (this: CustomWorld, field: string, message: string) {
    const actual = await this.adminManageEventsPage.getFieldError(field as AdminEventField);
    expect(actual).toBe(message);
  }
);

Given('the current total events count is noted', async function (this: CustomWorld) {
  this.totalEventsBeforeSubmit = await this.adminManageEventsPage.getTotalEventsCount();
});

Then('the total events count should be unchanged', async function (this: CustomWorld) {
  const after = await this.adminManageEventsPage.getTotalEventsCount();
  expect(after).toBe(this.totalEventsBeforeSubmit);
});

Then(
  'the created event should appear on the Events page with matching details',
  async function (this: CustomWorld) {
    const event = this.eventContext as EventFormData;

    await this.eventsPage.goto();
    await this.eventsPage.searchByTitle(event.title);
    await this.eventsPage.openEventByTitle(event.title);

    await this.eventDetailPage.verifyEventNameVisible(event.title);
    await this.eventDetailPage.verifyCategory(event.category);
    await this.eventDetailPage.verifyCity(event.city);
    await this.eventDetailPage.verifyDescription(event.description);
  }
);

Then('the {string} event row should be read-only', async function (this: CustomWorld, title: string) {
  await this.adminManageEventsPage.verifyRowIsReadOnly(title);
});

When('the user edits that event\'s city to {string}', async function (this: CustomWorld, city: string) {
  const event = this.eventContext as EventFormData;
  await this.adminManageEventsPage.clickEditForRow(event.title);
  await this.adminManageEventsPage.fillCity(city);
  await this.adminManageEventsPage.submit();
});

Then('that event\'s row should show the updated city {string}', async function (this: CustomWorld, city: string) {
  const event = this.eventContext as EventFormData;
  await this.adminManageEventsPage.verifyEventListed(event.title, event.category, city);
});

When('a ticket is booked for that event', async function (this: CustomWorld) {
  const event = this.eventContext as EventFormData;

  await this.eventsPage.goto();
  await this.eventsPage.searchByTitle(event.title);
  await this.eventsPage.openEventByTitle(event.title);
  await this.eventDetailPage.fillCustomerDetails('Cascade Tester', 'cascade.tester@example.com', '+994500000001');
  await this.eventDetailPage.clickConfirmBooking();
  this.bookingContext.bookingReference = await this.eventDetailPage.getBookingReference();

  await this.adminManageEventsPage.open();
});

When('the user deletes that event', async function (this: CustomWorld) {
  const event = this.eventContext as EventFormData;
  await this.adminManageEventsPage.clickDeleteForRow(event.title);
});

Then('that event\'s row should no longer be listed', async function (this: CustomWorld) {
  const event = this.eventContext as EventFormData;
  await this.adminManageEventsPage.verifyRowNotListed(event.title);
});

Then('that event\'s booking should no longer be listed', async function (this: CustomWorld) {
  await this.bookingsPage.goto();
  await this.bookingsPage.verifyBookingNotListed(this.bookingContext.bookingReference!);
});

Given('all dynamic events are deleted', async function (this: CustomWorld) {
  await this.adminManageEventsPage.deleteAllDynamicEvents();
});

When('the user creates {int} random events one after another', async function (this: CustomWorld, count: number) {
  this.eventTitlesCreated = [];
  for (let i = 0; i < count; i++) {
    const eventData = generateEventData();
    this.eventTitlesCreated.push(eventData.title);
    await this.adminManageEventsPage.fillAllFields(eventData);
    await this.adminManageEventsPage.submit();
    await this.adminManageEventsPage.getSuccessMessage();
  }
});

Then('the oldest of those events should no longer be listed', async function (this: CustomWorld) {
  await this.adminManageEventsPage.verifyRowNotListed(this.eventTitlesCreated[0]);
});

Then('the other {int} of those events should still be listed', async function (this: CustomWorld, count: number) {
  const stillListed = this.eventTitlesCreated.slice(this.eventTitlesCreated.length - count);
  for (const title of stillListed) {
    await this.adminManageEventsPage.verifyRowListed(title);
  }
});

Then('the total events count should be {int}', async function (this: CustomWorld, expectedTotal: number) {
  const total = await this.adminManageEventsPage.getTotalEventsCount();
  expect(total).toBe(expectedTotal);
});
