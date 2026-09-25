@e2e @registration
Feature: User Registration

  Background:
    Given the user is on the registration page

  Scenario: Successful registration with a new, randomly generated email and password
    When the user fills the registration form with randomly generated email and password
    And the user clicks the Create Account button
    Then the user should be redirected to the home page
    And the "Discover & Book Amazing Events" heading should be visible

  Scenario: Registration fails with an already registered email
    When the user fills the registration form with the already registered email and a valid password
    And the user clicks the Create Account button
    Then the registration error "Email already registered" should be displayed
    And the user should remain on the registration page

  Scenario: Registration fails with a password that does not meet the requirements
    When the user fills the registration form with a random email and the weak password "weak1"
    And the user clicks the Create Account button
    Then the password field error "Password does not meet the requirements below" should be displayed
    And the user should remain on the registration page
