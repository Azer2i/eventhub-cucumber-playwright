Feature: EventHub login

  Background:
    Given the user is on the login page

  Scenario: Successful login with valid credentials
    When the user enters a valid email and password
    And the user clicks the Sign In button
    Then the user should be redirected to the home page
    And the "Discover & Book Amazing Events" heading should be visible

  Scenario: Login fails with an incorrect email
    When the user enters the non-existent email "wrong.user@example.com" and a valid password
    And the user clicks the Sign In button
    Then the error message "Invalid email or password" should be displayed
    And the user should remain on the login page

  Scenario Outline: Login fails with an invalid email format
    When the user enters the email "<email>" and a valid password
    And the user clicks the Sign In button
    Then the error "Enter a valid email" should be displayed below the email field
    And the user should remain on the login page

    Examples:
      | email          |
      | test@gmail.    |
      | test@          |
      | test.gmail.com |

  Scenario: Login fails with an empty email
    When the user leaves the email field empty and enters a valid password
    And the user clicks the Sign In button
    Then the error "Enter a valid email" should be displayed below the email field
    And the user should remain on the login page

  Scenario: Login fails with an empty password
    When the user enters a valid email and leaves the password field empty
    And the user clicks the Sign In button
    Then the error "Password must be at least 6 characters" should be displayed below the password field
    And the user should remain on the login page

  Scenario: Login fails with a password shorter than 6 characters
    When the user enters a valid email and the password "12345"
    And the user clicks the Sign In button
    Then the error "Password must be at least 6 characters" should be displayed below the password field
    And the user should remain on the login page

  Scenario: Register link opens the registration page
    When the user clicks the Register link
    Then the user should be redirected to the registration page
    And the "Create your account" heading should be visible
