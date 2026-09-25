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
