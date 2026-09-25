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
