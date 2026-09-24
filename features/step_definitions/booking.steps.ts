import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { generateFullName, generateUniqueEmail, generatePhoneNumber } from '../../utils/testData';

When('the user opens the Events page', async function (this: CustomWorld) {
  await this.eventsPage.goto();
});

When(
  'the user selects the first featured event and remembers its name and ticket price',
  async function (this: CustomWorld) {
    this.bookingContext.eventName = await this.eventsPage.getFirstFeaturedEventName();
    this.bookingContext.ticketPrice = await this.eventsPage.getFirstFeaturedEventPrice();
    this.log(`Selected event: "${this.bookingContext.eventName}" at $${this.bookingContext.ticketPrice} per ticket`);
  }
);

When('the user clicks the Book Now button', async function (this: CustomWorld) {
  await this.eventsPage.clickBookNowOnFirstFeaturedEvent();
});

Then('the event detail page should show the selected event', async function (this: CustomWorld) {
  await this.eventDetailPage.verifyEventNameVisible(this.bookingContext.eventName!);
});

When('the user sets the number of tickets to {int}', async function (this: CustomWorld, ticketCount: number) {
  await this.eventDetailPage.setTicketCount(ticketCount);
  this.bookingContext.ticketCount = ticketCount;
});

When('the user fills the booking form with randomly generated customer details', async function (this: CustomWorld) {
  const customerName = generateFullName();
  const customerEmail = generateUniqueEmail();
  const customerPhone = generatePhoneNumber();

  this.bookingContext.customerName = customerName;
  this.bookingContext.customerEmail = customerEmail;
  this.bookingContext.customerPhone = customerPhone;

  this.log(`Generated customer details: ${customerName}, ${customerEmail}, ${customerPhone}`);

  await this.eventDetailPage.fillCustomerDetails(customerName, customerEmail, customerPhone);
});

Then(
  'the total price should equal the ticket price multiplied by {int}',
  async function (this: CustomWorld, multiplier: number) {
    const expectedTotal = this.bookingContext.ticketPrice! * multiplier;
    const actualTotal = await this.eventDetailPage.getTotalAmount();
    this.log(`Expected total: $${expectedTotal}, actual total: $${actualTotal}`);
    expect(actualTotal).toBe(expectedTotal);
  }
);

When('the user clicks the Confirm Booking button', async function (this: CustomWorld) {
  await this.eventDetailPage.clickConfirmBooking();
});

Then('the {string} message should be displayed', async function (this: CustomWorld, message: string) {
  await this.eventDetailPage.verifyBookingConfirmed(message);
});

Then('the booking reference should be captured', async function (this: CustomWorld) {
  this.bookingContext.bookingReference = await this.eventDetailPage.getBookingReference();
  this.log(`Booking reference: ${this.bookingContext.bookingReference}`);
});

When('the user clicks the View My Bookings link', async function (this: CustomWorld) {
  await this.eventDetailPage.clickViewMyBookings();
});

Then('the booking with the captured reference should be listed', async function (this: CustomWorld) {
  await this.bookingsPage.verifyBookingListed(this.bookingContext.bookingReference!);
});

When('the user opens the details of the booking with the captured reference', async function (this: CustomWorld) {
  await this.bookingsPage.openBookingDetails(this.bookingContext.bookingReference!);
});

Then('the booking details should show the selected event name', async function (this: CustomWorld) {
  await this.bookingDetailPage.verifyEventName(this.bookingContext.eventName!);
});

Then(
  'the booking details should show the entered customer name, email and phone',
  async function (this: CustomWorld) {
    await this.bookingDetailPage.verifyCustomerDetails(
      this.bookingContext.customerName!,
      this.bookingContext.customerEmail!,
      this.bookingContext.customerPhone!
    );
  }
);

Then('the booking details should show the correct payment total', async function (this: CustomWorld) {
  const expectedTotal = this.bookingContext.ticketPrice! * this.bookingContext.ticketCount!;
  const actualTotal = await this.bookingDetailPage.getTotalPaid();
  this.log(`Expected payment total: $${expectedTotal}, actual: $${actualTotal}`);
  expect(actualTotal).toBe(expectedTotal);
});
