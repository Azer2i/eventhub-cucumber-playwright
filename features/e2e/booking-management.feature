@e2e @booking-management
Feature: Booking management

  Background:
    Given the user is logged in
    When the user opens the Events page

  Scenario: Booking reference starts with the event's first letter
    When the user opens the event "World Tech Summit"
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then the booking reference should be captured
    And the booking reference should start with "W"

  Scenario: Ticket count cannot exceed the maximum of 10
    When the user opens the event "World Tech Summit"
    Then the ticket count should be capped at 10

  Scenario Outline: Booking fails when a required customer field is left empty
    When the user opens the event "World Tech Summit"
    And the user fills the booking form leaving the "<field>" field empty
    And the user clicks the Confirm Booking button
    Then the "<field>" customer field should show the error "<message>"

    Examples:
      | field | message                       |
      | name  | Name must be at least 2 chars |
      | email | Enter a valid email           |
      | phone | Enter a valid 10-digit phone  |

  Scenario: The same event can be booked multiple times by the same user
    When the user opens the event "World Tech Summit"
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then the booking reference should be captured
    When the user opens the event "World Tech Summit"
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then a second, different booking reference should be captured

  Scenario: A single-ticket booking is eligible for a full refund
    When the user opens the event "World Tech Summit"
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then the booking reference should be captured
    When the user clicks the View My Bookings link
    And the user opens the details of the booking with the captured reference
    And the user checks the refund eligibility
    Then the booking should be eligible for a full refund

  Scenario: A group booking is not eligible for a refund
    When the user opens the event "World Tech Summit"
    And the user sets the number of tickets to 2
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then the booking reference should be captured
    When the user clicks the View My Bookings link
    And the user opens the details of the booking with the captured reference
    And the user checks the refund eligibility
    Then the booking should not be eligible for a refund for 2 tickets

  Scenario: Cancelling a booking removes it from the list
    When the user opens the event "World Tech Summit"
    And the user fills the booking form with randomly generated customer details
    And the user clicks the Confirm Booking button
    Then the booking reference should be captured
    When the user clicks the View My Bookings link
    Then the booking with the captured reference should be listed
    When the user cancels the booking with the captured reference
    Then the booking with the captured reference should no longer be listed
