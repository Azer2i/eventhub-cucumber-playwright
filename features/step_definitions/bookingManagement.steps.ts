import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { generateFullName, generateUniqueEmail, generatePhoneNumber } from '../../utils/testData';
import { CustomerField } from '../../pageObjects/EventDetailPage';

When('the user opens the event {string}', async function (this: CustomWorld, title: string) {
  await this.eventsPage.goto();
  await this.eventsPage.searchByTitle(title);
  await this.eventsPage.openEventByTitle(title);
  this.bookingContext.eventName = title;
});

Then('the booking reference should start with {string}', async function (this: CustomWorld, letter: string) {
  expect(this.bookingContext.bookingReference?.charAt(0)).toBe(letter);
});

Then('the ticket count should be capped at {int}', async function (this: CustomWorld, max: number) {
  await this.eventDetailPage.verifyTicketCountCapped(max);
});

When(
  'the user fills the booking form leaving the {string} field empty',
  async function (this: CustomWorld, field: string) {
    const name = field === 'name' ? '' : generateFullName();
    const email = field === 'email' ? '' : generateUniqueEmail();
    const phone = field === 'phone' ? '' : generatePhoneNumber();
    await this.eventDetailPage.fillCustomerDetails(name, email, phone);
  }
);

Then(
  'the {string} customer field should show the error {string}',
  async function (this: CustomWorld, field: string, message: string) {
    const actual = await this.eventDetailPage.getCustomerFieldError(field as CustomerField);
    expect(actual).toBe(message);
  }
);

Then('a second, different booking reference should be captured', async function (this: CustomWorld) {
  const firstReference = this.bookingContext.bookingReference;
  const secondReference = await this.eventDetailPage.getBookingReference();
  expect(secondReference).not.toBe(firstReference);
  this.bookingContext.bookingReference = secondReference;
});

When('the user checks the refund eligibility', async function (this: CustomWorld) {
  await this.bookingDetailPage.clickCheckRefundEligibility();
});

Then('the booking should be eligible for a full refund', async function (this: CustomWorld) {
  await this.bookingDetailPage.verifyEligibleForRefund();
});

Then(
  'the booking should not be eligible for a refund for {int} tickets',
  async function (this: CustomWorld, ticketCount: number) {
    await this.bookingDetailPage.verifyNotEligibleForRefund(ticketCount);
  }
);

When('the user cancels the booking with the captured reference', async function (this: CustomWorld) {
  await this.bookingsPage.cancelBooking(this.bookingContext.bookingReference!);
});

Then('the booking with the captured reference should no longer be listed', async function (this: CustomWorld) {
  await this.bookingsPage.verifyBookingNotListed(this.bookingContext.bookingReference!);
});
