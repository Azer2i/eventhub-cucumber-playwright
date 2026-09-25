@e2e @browse
Feature: Browse and filter events

  Background:
    Given the user is logged in
    When the user opens the Events page

  Scenario: Searching by title returns only the matching event
    When the user searches for "World Tech Summit"
    Then only the "World Tech Summit" event should be visible

  Scenario: Searching for a non-existent event shows no results
    When the user searches for "zzzznonexistent12345"
    Then no events should be found

  Scenario: Filtering by category shows only matching events
    When the user filters by category "Conference"
    Then every visible event card should contain "Conference"

  Scenario: Filtering by city shows only matching events
    When the user filters by city "Hyderabad"
    Then every visible event card should contain "Hyderabad"

  Scenario: Combining search and category filters narrows results with AND logic
    When the user filters by category "Concert"
    And the user searches for "World Tech Summit"
    Then no events should be found

  Scenario: Clear filters resets the search and filters
    When the user searches for "zzzznonexistent12345"
    And the user clicks the Clear filters button
    Then the search field should be empty
    And at least one event card should be visible
