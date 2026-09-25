@e2e @booking
Feature: Event booking journey

  Background:
    Given the user is logged in

  Scenario: User books tickets for an event and verifies the booking details
    When the user opens the Events page
    And the user selects the first featured event and remembers its name and ticket price
    And the user clicks the Book Now button
    Then the event detail page should show the selected event
    When the user sets the number of tickets to 2
    And the user fills the booking form with randomly generated customer details
    Then the total price should equal the ticket price multiplied by 2
    When the user clicks the Confirm Booking button
    Then the "Booking Confirmed" message should be displayed
    And the booking reference should be captured
    When the user clicks the View My Bookings link
    Then the booking with the captured reference should be listed
    When the user opens the details of the booking with the captured reference
    Then the booking details should show the selected event name
    And the booking details should show the entered customer name, email and phone
    And the booking details should show the correct payment total
