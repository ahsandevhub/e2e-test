import dotenv from "dotenv";
import { By, DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

class ForgotPasswordPage {
  constructor(driver) {
    this.driver = driver;
    this.forgotPasswordUrl = process.env.FORGOT_PASSWORD_URL;

    // Selectors - optimized for Ant Design
    this.selectors = {
      emailInput: By.xpath(
        "//input[@placeholder='Email'] | //input[@name='email'] | //input[@type='email'] | //input[contains(@placeholder,'mail')] | //input"
      ),
      submitButton: By.xpath(
        "//button[text()='Submit'] | //button[@type='submit']"
      ),
      loginNowLink: By.xpath(
        "//a[text()='Login now'] | //a[contains(@href, '/auth/login')] | //a[contains(text(), 'Login')]"
      ),
      forgotPasswordForm: By.xpath(
        "//form | //div[contains(@class, 'ant-form')]"
      ),
      errorMessage: By.xpath(
        "//*[contains(@class, 'ant-message')] | //*[contains(text(), 'User not found')] | //*[contains(text(), 'not found')] | //*[contains(text(), 'Error')] | //*[contains(@class, 'error')] | //*[contains(text(), 'Please enter a valid email')]"
      ),
      validationError: By.xpath(
        "//*[contains(text(), 'Please enter a valid email')] | //*[contains(@class, 'ant-form-item-explain')] | //*[contains(@class, 'error')] | //*[contains(text(), 'valid email')]"
      ),
      successMessage: By.xpath(
        "//*[contains(@class, 'ant-message')] | //*[contains(text(), 'sent')] | //*[contains(text(), 'reset')]"
      ),
    };
  }

  /**
   * Navigate to the forgot password page
   */
  async open() {
    await this.driver.get(this.forgotPasswordUrl);
    await DriverFactory.waitForVisible(this.driver, this.selectors.emailInput);
    await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.submitButton
    );
  }

  /**
   * Fill in the email field
   * @param {string} email - Email address to enter
   */
  async fillEmail(email) {
    const emailField = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.emailInput
    );
    await emailField.clear();
    await emailField.sendKeys(email);
  }

  /**
   * Click the submit button
   */
  async submit() {
    await DriverFactory.safeClick(this.driver, this.selectors.submitButton);
  }

  /**
   * Complete password reset request process
   * @param {string} email - Email address for password reset
   */
  async requestReset(email) {
    await this.fillEmail(email);
    await this.submit();

    // Wait a moment for the request to be processed
    await this.driver.sleep(1000);
  }

  /**
   * Click the "Login now" link to go back to login
   */
  async clickLoginNow() {
    await DriverFactory.safeClick(this.driver, this.selectors.loginNowLink);
  }

  /**
   * Check if there's an error message displayed
   * @returns {Promise<boolean>} True if error message is visible
   */
  async expectErrorVisible() {
    try {
      await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.errorMessage,
        10000
      );
      return true;
    } catch (error) {
      throw new Error("Expected error message to be visible but was not found");
    }
  }

  /**
   * Check if there's a success message displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async hasSuccessMessage() {
    try {
      await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.successMessage,
        5000
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get error message text if present
   * @returns {Promise<string|null>} Error message text or null
   */
  async getErrorMessage() {
    try {
      const errorElement = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.errorMessage,
        5000
      );
      return await errorElement.getText();
    } catch (error) {
      return null;
    }
  }

  /**
   * Get success message text if present
   * @returns {Promise<string|null>} Success message text or null
   */
  async getSuccessMessage() {
    try {
      const successElement = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.successMessage,
        5000
      );
      return await successElement.getText();
    } catch (error) {
      return null;
    }
  }

  /**
   * Check for email validation errors
   * @returns {Promise<boolean>} True if validation error is present
   */
  async hasValidationError() {
    try {
      const validationElements = await this.driver.findElements(
        this.selectors.validationError
      );
      return validationElements.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get validation error message text
   * @returns {Promise<string|null>} Validation error text or null
   */
  async getValidationError() {
    try {
      const validationElement = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.validationError,
        3000
      );
      return await validationElement.getText();
    } catch (error) {
      return null;
    }
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    try {
      // If there's a loading indicator, wait for it to disappear
      await DriverFactory.waitForGone(
        this.driver,
        this.selectors.loadingIndicator,
        10000
      );
    } catch (error) {
      // Loading indicator might not exist, which is fine
    }
  }

  /**
   * Verify we are on the forgot password page
   */
  async expectAtForgotPassword() {
    // Wait for concrete controls to be visible
    await DriverFactory.waitForVisible(this.driver, this.selectors.emailInput);
    await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.submitButton
    );

    // Check URL contains forgot-password
    await DriverFactory.waitUrlContains(this.driver, "/auth/forgot-password");

    // Verify submit button is present
    const submitButton = await this.driver.findElement(
      this.selectors.submitButton
    );
    const isDisplayed = await submitButton.isDisplayed();

    if (!isDisplayed) {
      throw new Error("Submit button is not visible on forgot password page");
    }

    return true;
  }
}

export default ForgotPasswordPage;
