import dotenv from "dotenv";
import { By, DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.loginUrl = process.env.LOGIN_URL;

    // Selectors - optimized for Ant Design
    this.selectors = {
      usernameInput: By.xpath(
        "//input[@type='text'] | //input[@placeholder='User name']"
      ),
      passwordInput: By.xpath(
        "//input[@type='password'] | //input[@name='password']"
      ),
      usernameError: By.xpath(
        "//div[contains(@class,'ant-form-item-explain') or contains(@class,'error') or contains(@class,'help-block')]//*[contains(text(),'Please input') or contains(text(),'username') or contains(text(),'required')]"
      ),
      passwordError: By.xpath(
        "//div[contains(@class,'ant-form-item-explain') or contains(@class,'error') or contains(@class,'help-block')]//*[contains(text(),'Please input') or contains(text(),'password') or contains(text(),'required')]"
      ),
      validationErrors: By.xpath(
        "//div[contains(@class,'ant-form-item-explain') or contains(@class,'error') or contains(@class,'help-block') or contains(@class,'invalid-feedback')] | //*[contains(text(),'Please input') or contains(text(),'required') or contains(text(),'This field is required')]"
      ),
      rememberMeCheckbox: By.xpath(
        "//input[@type='checkbox'] | //span[contains(@class,'ant-checkbox')]"
      ),
      submitButton: By.xpath(
        "//button[@type='submit'] | //button[text()='Submit']"
      ),
      forgotPasswordLink: By.xpath(
        "//a[contains(text(), 'Forgot your password')]"
      ),
      loginForm: By.xpath("//form | //div[contains(@class, 'ant-form')]"),
      errorMessage: By.xpath(
        "//div[contains(@class,'ant-message')] | //div[contains(@class,'ant-notification')] | //*[contains(text(),'Incorrect email or password')] | //*[contains(text(),'The account does not exist')] | //*[contains(text(),'Make sure you entered correctly')] | //*[contains(text(),'Invalid')] | //*[contains(text(),'error')] | //*[@class='error']"
      ),
    };
  }

  /**
   * Navigate to the login page
   */
  async open() {
    await this.driver.get(this.loginUrl);
    await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.usernameInput
    );
    await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.passwordInput
    );
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
    await usernameField.clear();
    await usernameField.sendKeys(username);
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
    await passwordField.clear();
    await passwordField.sendKeys(password);
  }

  /**
   * Toggle the "Remember me" checkbox
   * @param {boolean} shouldCheck - Whether to check or uncheck the checkbox
   */
  async toggleRememberMe(shouldCheck = true) {
    try {
      const checkbox = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.rememberMeCheckbox,
        3000
      );
      const isChecked = await checkbox.isSelected();
      if (isChecked !== shouldCheck) {
        await checkbox.click();
      }
    } catch (error) {
      console.warn("Remember me checkbox not found, skipping...");
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

      // Look for any text containing validation keywords
      const allElements = await this.driver.findElements(
        By.xpath(
          "//*[contains(text(),'Please') or contains(text(),'required') or contains(text(),'input') or contains(text(),'field')]"
        )
      );

      for (let i = 0; i < allElements.length; i++) {
        try {
          const text = await allElements[i].getText();
          const tagName = await allElements[i].getTagName();
          const className = await allElements[i].getAttribute("class");
          if (text.trim()) {
            console.log(
              `Found element: ${tagName}, class: ${className}, text: "${text}"`
            );
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
      // Check for generic validation errors first
      const validationErrors = await this.driver.findElements(
        this.selectors.validationErrors
      );
      if (validationErrors.length > 0) {
        return true;
      }

      // Check specific field errors
      const usernameError = await this.driver.findElements(
        this.selectors.usernameError
      );
      const passwordError = await this.driver.findElements(
        this.selectors.passwordError
      );
      return usernameError.length > 0 || passwordError.length > 0;
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
   * Get error message text
   */
  async getErrorMessage() {
    try {
      const errorElement = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.errorMessage,
        3000
      );
      return await errorElement.getText();
    } catch (error) {
      return null;
    }
  }
}

export default LoginPage;
