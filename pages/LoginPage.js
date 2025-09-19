import dotenv from "dotenv";
import { By, DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.loginUrl = process.env.LOGIN_URL;

    // Selectors - based on actual HTML structure
    this.selectors = {
      usernameInput: By.id("loginForm_username"),
      passwordInput: By.id("loginForm_password"),
      rememberMeCheckbox: By.css(".ant-checkbox-input"),
      rememberMeWrapper: By.css(".ant-checkbox-wrapper"),
      submitButton: By.css("button[type='submit']"),
      forgotPasswordLink: By.css("a[href='/auth/forgot-password']"),
      loginForm: By.id("loginForm"),
      validationErrors: By.css(".ant-form-item-explain-error"),
      errorMessage: By.css(".ant-message, .ant-notification"),
    };
  }

  /**
   * Navigate to the login page
   */
  async open() {
    await this.driver.get(this.loginUrl);
    await DriverFactory.waitForVisible(this.driver, this.selectors.loginForm);
  }

  /**
   * Fill in the username field
   * @param {string} username - Username to enter
   */
  async fillUsername(username) {
    const usernameField = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.usernameInput
    );

    // Aggressive clearing for Ant Design forms
    await usernameField.click(); // Focus first
    await usernameField.clear();
    await this.driver.executeScript("arguments[0].value = '';", usernameField);
    await this.driver.executeScript(
      "arguments[0].setAttribute('value', '');",
      usernameField
    );

    // Use keyboard shortcuts to clear (Ctrl+A, Delete)
    const Key = this.driver.Key || require("selenium-webdriver").Key;
    await usernameField.sendKeys(Key.CONTROL + "a");
    await usernameField.sendKeys(Key.DELETE);
    await usernameField.sendKeys(Key.BACK_SPACE);

    // Trigger events to notify Ant Design
    await this.driver.executeScript(
      `
      const element = arguments[0];
      element.value = '';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    `,
      usernameField
    );

    if (username) {
      await usernameField.sendKeys(username);
    }
  }

  /**
   * Fill in the password field
   * @param {string} password - Password to enter
   */
  async fillPassword(password) {
    const passwordField = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.passwordInput
    );

    // Aggressive clearing for Ant Design forms
    await passwordField.click(); // Focus first
    await passwordField.clear();
    await this.driver.executeScript("arguments[0].value = '';", passwordField);
    await this.driver.executeScript(
      "arguments[0].setAttribute('value', '');",
      passwordField
    );

    // Use keyboard shortcuts to clear (Ctrl+A, Delete)
    const Key = this.driver.Key || require("selenium-webdriver").Key;
    await passwordField.sendKeys(Key.CONTROL + "a");
    await passwordField.sendKeys(Key.DELETE);
    await passwordField.sendKeys(Key.BACK_SPACE);

    // Trigger events to notify Ant Design
    await this.driver.executeScript(
      `
      const element = arguments[0];
      element.value = '';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    `,
      passwordField
    );

    if (password) {
      await passwordField.sendKeys(password);
    }
  }

  /**
   * Toggle the "Remember me" checkbox
   * @param {boolean} shouldCheck - Whether to check or uncheck the checkbox
   */
  async toggleRememberMe(shouldCheck = true) {
    try {
      // Use findElement instead of waitForVisible since the checkbox exists but might be hidden
      const checkbox = await this.driver.findElement(
        this.selectors.rememberMeCheckbox
      );

      const isChecked = await checkbox.isSelected();
      console.log(
        `🔍 Checkbox current state: ${isChecked}, want: ${shouldCheck}`
      );

      if (isChecked !== shouldCheck) {
        // Try clicking the wrapper first (Ant Design pattern)
        try {
          const wrapper = await this.driver.findElement(
            this.selectors.rememberMeWrapper
          );
          await this.driver.executeScript("arguments[0].click();", wrapper);
          console.log("✅ Clicked checkbox wrapper using JavaScript");
        } catch (wrapperError) {
          // Fallback to clicking the input directly with JavaScript
          await this.driver.executeScript("arguments[0].click();", checkbox);
          console.log("✅ Clicked checkbox input directly using JavaScript");
        }

        // Wait a moment for the state to update
        await this.driver.sleep(500);

        // Verify the state changed
        const newState = await checkbox.isSelected();
        console.log(`🔍 Checkbox new state: ${newState}`);
      } else {
        console.log("✅ Checkbox already in desired state");
      }
    } catch (error) {
      console.warn("❌ Remember me checkbox not found:", error.message);
    }
  }

  /**
   * Click the submit button
   */
  async submit() {
    const submitButton = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.submitButton
    );
    await submitButton.click();
  }

  /**
   * Perform complete login
   * @param {string} username - Username to enter
   * @param {string} password - Password to enter
   * @param {boolean} rememberMe - Whether to check "Remember me"
   */
  async login(username, password, rememberMe = false) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    if (rememberMe) {
      await this.toggleRememberMe(true);
    }
    await this.submit();
  }

  /**
   * Click the forgot password link
   */
  async clickForgotPassword() {
    const forgotLink = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.forgotPasswordLink
    );
    await forgotLink.click();
  }

  /**
   * Check if login form is displayed
   */
  async isFormDisplayed() {
    try {
      await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.loginForm,
        3000
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Debug method to see what validation errors are present
   */
  async debugValidationErrors() {
    try {
      console.log("🔍 Debugging validation errors...");
      const validationElements = await this.driver.findElements(
        this.selectors.validationErrors
      );

      for (const element of validationElements) {
        try {
          const text = await element.getText();
          if (text.trim()) {
            console.log(`Validation error: "${text}"`);
          }
        } catch (e) {
          // Skip if element is stale
        }
      }
    } catch (error) {
      console.log("Debug failed:", error.message);
    }
  }

  /**
   * Check for validation errors
   */
  async hasValidationErrors() {
    try {
      const validationErrors = await this.driver.findElements(
        this.selectors.validationErrors
      );
      return validationErrors.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check for error messages
   */
  async hasErrorMessage() {
    try {
      const errorElements = await this.driver.findElements(
        this.selectors.errorMessage
      );
      return errorElements.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all form fields and trigger validation
   */
  async clearAllFields() {
    try {
      console.log("🧹 Clearing all form fields...");

      // Clear username
      await this.fillUsername("");
      // Clear password
      await this.fillPassword("");

      // Click somewhere to trigger validation errors
      const usernameField = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.usernameInput
      );
      await usernameField.click();

      console.log("✅ Form fields cleared");
    } catch (error) {
      console.warn("❌ Failed to clear all fields:", error.message);
    }
  }

  /**
   * Refresh the login page (last resort for clearing)
   */
  async refreshPage() {
    try {
      console.log("🔄 Refreshing login page to ensure clean state...");
      await this.driver.navigate().refresh();
      await DriverFactory.waitForVisible(this.driver, this.selectors.loginForm);
      console.log("✅ Page refreshed");
    } catch (error) {
      console.warn("❌ Failed to refresh page:", error.message);
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    try {
      const errorElements = await this.driver.findElements(
        this.selectors.errorMessage
      );
      return errorElements.length > 0 ? await errorElements[0].getText() : null;
    } catch (error) {
      return null;
    }
  }
}

export default LoginPage;
