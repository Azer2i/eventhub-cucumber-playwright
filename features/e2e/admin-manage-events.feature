@e2e @admin
Feature: Admin - Manage Events

  Background:
    Given the user is logged in
    When the user opens the Admin Manage Events page

  Scenario: Admin creates a new event with valid, randomly generated data
    When the user fills the event form with randomly generated event data
    And the user submits the event form
    Then the success message "Event created!" should be displayed
    And the created event should appear on the Events page with matching details

  Scenario: Creating an event fails when the title is missing
    Given the current total events count is noted
    When the user fills the event form with randomly generated data, leaving the "title" field empty
    And the user submits the event form
    Then the "title" field should show the error "Title is required"
    And the total events count should be unchanged

  Scenario: Creating an event fails when the price is missing
    Given the current total events count is noted
    When the user fills the event form with randomly generated data, leaving the "price" field empty
    And the user submits the event form
    Then the "price" field should show the error "Enter a valid price (≥ 0)"
    And the total events count should be unchanged

  Scenario: Creating an event fails when the venue is missing
    Given the current total events count is noted
    When the user fills the event form with randomly generated data, leaving the "venue" field empty
    And the user submits the event form
    Then the "venue" field should show the error "Venue is required"
    And the total events count should be unchanged

  Scenario: Creating an event fails when the date is missing
    Given the current total events count is noted
    When the user fills the event form with randomly generated data, leaving the "date" field empty
    And the user submits the event form
    Then the "date" field should show the error "Event date is required"
    And the total events count should be unchanged

  Scenario: Creating an event fails when the seats field is missing
    Given the current total events count is noted
    When the user fills the event form with randomly generated data, leaving the "seats" field empty
    And the user submits the event form
    Then the "seats" field should show the error "Must have at least 1 seat"
    And the total events count should be unchanged

  Scenario: A static (seeded) event is read-only and cannot be edited or deleted
    Then the "World Tech Summit" event row should be read-only

  Scenario: Editing a dynamic event updates its details
    When the user fills the event form with randomly generated event data
    And the user submits the event form
    And the user edits that event's city to "Pune"
    Then the success message "Event updated!" should be displayed
    And that event's row should show the updated city "Pune"

  Scenario: Deleting a dynamic event removes it and its bookings
    When the user fills the event form with randomly generated event data
    And the user submits the event form
    And a ticket is booked for that event
    And the user deletes that event
    Then the success message "Event deleted" should be displayed
    And that event's row should no longer be listed
    And that event's booking should no longer be listed

  Scenario: Creating a 7th event automatically evicts the oldest one (FIFO)
    Given all dynamic events are deleted
    When the user creates 7 random events one after another
    Then the oldest of those events should no longer be listed
    And the other 6 of those events should still be listed
    And the total events count should be 9
