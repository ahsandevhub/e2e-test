import dotenv from "dotenv";
import { By, DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

class CreateDiscountPage {
  constructor(driver) {
    this.driver = driver;
    this.createUrl = process.env.CREATE_DISCOUNT_URL;

    // Selectors optimized for actual form structure based on screenshot
    this.selectors = {
      // Main form fields - based on actual debug data
      codeInput: By.xpath(
        "//input[@id='code'] | //input[contains(@placeholder,'510ZERO')] | //input[@placeholder='e.g. \"510ZERO\"'] | //input[@name='discountCode'] | //label[contains(text(),'Discount Code')]/..//input"
      ),
      // Toggle switches - likely implemented as buttons, not checkbox inputs
      publicCheckbox: By.xpath(
        "//*[contains(text(),'Public to user')]/following-sibling::*//button | //*[contains(text(),'Public to user')]/..//button | //label[contains(text(),'Public to user')]//button | //button[contains(@class,'switch') or contains(@class,'toggle')]"
      ),
      autoDisplayTradingCheckbox: By.xpath(
        "//*[contains(text(),'Auto Display in Checkout For Trading Capital')]/following-sibling::*//button | //*[contains(text(),'Auto Display in Checkout For Trading Capital')]/..//button | //label[contains(text(),'Auto Display in Checkout For Trading Capital')]//button"
      ),
      autoDisplayCustomCheckbox: By.xpath(
        "//*[contains(text(),'Auto display in Customize Package')]/following-sibling::*//button | //*[contains(text(),'Auto display in Customize Package')]/..//button | //label[contains(text(),'Auto display in Customize Package')]//button"
      ),

      // Radio buttons for discount type - based on debug data showing name="«rf»"
      percentRadio: By.xpath(
        "(//input[@type='radio' and @name='«rf»'])[1] | //span[contains(text(),'Percentage Discount')]/..//input[@type='radio'] | //label[contains(text(),'Percentage Discount')]//input[@type='radio']"
      ),
      fixedRadio: By.xpath(
        "(//input[@type='radio' and @name='«rf»'])[2] | //span[contains(text(),'Fixed Amount Discount')]/..//input[@type='radio'] | //label[contains(text(),'Fixed Amount Discount')]//input[@type='radio']"
      ),

      // Percentage discount fields - based on debug data
      percentageOffInput: By.xpath(
        "//input[@id='percentageOff'] | //input[@placeholder='Enter percentage off'] | //input[@name='percentageOff'] | //label[contains(text(),'Percentage Off')]/..//input"
      ),
      maximumAmountInput: By.xpath(
        "//input[@id='maximumDiscountAmount'] | //input[@placeholder='Enter maximum amount'] | //input[@name='maximumAmount'] | //label[contains(text(),'Maximum amount')]/..//input"
      ),

      // Fixed discount field
      fixedAmountInput: By.xpath(
        "//input[@placeholder='Enter discount amount'] | //input[@name='fixedAmount'] | //input[@name='discountAmount'] | //label[contains(text(),'Discount Amount')]/..//input"
      ),

      // Minimum value radio buttons - based on debug data showing name="«rg»"
      minInitialBalanceRadio: By.xpath(
        "(//input[@type='radio' and @name='«rg»'])[1] | //label[contains(text(),'Minimum Initial Balance')]//input[@type='radio'] | //span[contains(text(),'Minimum Initial Balance')]//input[@type='radio']"
      ),
      minInitialBalanceInput: By.xpath(
        "//input[@placeholder='Enter Minimum Initial Balance'] | //input[@name='minInitialBalance'] | //label[contains(text(),'Minimum Initial Balance')]/..//input[@type='text' or @type='number']"
      ),
      minAmountRadio: By.xpath(
        "(//input[@type='radio' and @name='«rg»'])[2] | //label[contains(text(),'Minimum Amount')]//input[@type='radio'] | //span[contains(text(),'Minimum Amount')]//input[@type='radio']"
      ),
      minAmountInput: By.xpath(
        "//input[@placeholder='Enter Minimum Amount'] | //input[@name='minAmount'] | //label[contains(text(),'Minimum Amount')]/..//input[@type='text' or @type='number']"
      ),

      // Other form fields
      descriptionInput: By.xpath(
        "//textarea[@placeholder='Enter Description'] | //textarea[@name='description'] | //input[@name='description'] | //label[contains(text(),'Description')]/..//textarea"
      ),
      expirationDateInput: By.xpath(
        "//input[@placeholder='Select date'] | //input[@name='expirationDate'] | //input[@type='date'] | //label[contains(text(),'Expiration Date')]/..//input"
      ),
      specifyQuantityInput: By.xpath(
        "//input[@id='specificQuantity'] | //input[@placeholder='Enter Quantities'] | //input[@name='specifyQuantity'] | //input[@name='maxQuantityUsage'] | //label[contains(text(),'Specific Quantity Usage')]/..//input"
      ),
      maxPerUserInput: By.xpath(
        "//input[@name='maxPerUser'] | //input[@name='maxQuantityPerUser'] | //label[contains(text(),'Max Quantity per user')]/..//input"
      ),

      // Package management
      addPackageButton: By.xpath(
        "//button[contains(text(),'Add New Package')] | //button[contains(text(),'Add Package')] | //button[@name='addPackage'] | //*[contains(@class,'btn') and contains(text(),'Add Package')]"
      ),
      packagePopup: By.xpath(
        "//div[contains(@class,'modal') or contains(@class,'popup') or contains(@class,'dialog')] | //div[@role='dialog']"
      ),
      packageIdInput: By.xpath(
        "//input[@name='packageId'] | //input[contains(@placeholder,'Package ID')] | //input[contains(@placeholder,'Challenge ID')] | //label[contains(text(),'Package ID')]/..//input"
      ),
      packageSaveButton: By.xpath(
        "//button[contains(text(),'Save') and ancestor::*[contains(@class,'modal') or contains(@class,'popup')]] | //div[contains(@class,'modal')]//button[contains(text(),'Save')]"
      ),

      // Email management
      addEmailInput: By.xpath(
        "//input[@placeholder='Enter Email'] | //input[@name='email'] | //input[contains(@placeholder,'email')] | //label[contains(text(),'Specific Email')]/..//input"
      ),
      addEmailButton: By.xpath(
        "//label[contains(text(),'Specific Email')]/..//button[contains(text(),'Add')] | //input[@placeholder='Enter Email']/following-sibling::button | //button[contains(text(),'Add') and preceding-sibling::*//input[@placeholder='Enter Email']]"
      ),

      // AP Referral
      apReferralInput: By.xpath(
        "//input[@placeholder='Enter AP Referral'] | //input[@name='apReferral'] | //input[contains(@placeholder,'AP Referral')] | //label[contains(text(),'AP Referral')]/..//input"
      ),
      apReferralAddButton: By.xpath(
        "//label[contains(text(),'AP Referral')]/..//button[contains(text(),'Add')] | //input[@placeholder='Enter AP Referral']/following-sibling::button | //button[contains(text(),'Add') and preceding-sibling::*//input[@placeholder='Enter AP Referral']]"
      ),

      // Status toggle - likely implemented as button
      statusToggle: By.xpath(
        "//*[contains(text(),'Active')]/following-sibling::*//button | //*[contains(text(),'Active')]/..//button | //label[contains(text(),'Active')]//button | //button[contains(@class,'switch') or contains(@class,'toggle')]"
      ),

      // Action buttons
      cancelButton: By.xpath(
        "//button[contains(text(),'Cancel')] | //button[@name='cancel'] | //*[contains(@class,'btn') and contains(text(),'Cancel')]"
      ),
      createButton: By.xpath(
        "//button[contains(text(),'Create')] | //button[contains(text(),'Save')] | //button[contains(text(),'Submit')] | //button[@type='submit'] | //*[contains(@class,'btn-primary') or contains(@class,'primary')]"
      ),

      // Feedback elements
      toast: By.xpath(
        "//div[contains(@class,'toast') or contains(@class,'notification') or contains(@class,'message') or contains(@class,'ant-message')] | //*[contains(@class,'success') or contains(@class,'error') or contains(@class,'info')]"
      ),
      formErrors: By.xpath(
        "//div[contains(@class,'error') or contains(@class,'invalid-feedback') or contains(@class,'ant-form-item-explain')] | //*[contains(@class,'field-error') or contains(@class,'validation-error')]"
      ),

      // Specific error messages
      codeRequiredError: By.xpath(
        "//*[contains(text(),'Please fill out this field') or contains(text(),'required')]"
      ),
      codeFormatError: By.xpath(
        "//*[contains(text(),'Accept only latin letters, numbers, underscore') or contains(text(),'no space permitted')]"
      ),
      codeLengthError: By.xpath(
        "//*[contains(text(),'Only accepted 15 characters for code')]"
      ),
      codeDuplicateError: By.xpath(
        "//*[contains(text(),'This code has already been created')]"
      ),
      percentageRangeError: By.xpath(
        "//*[contains(text(),'Enter a number greater than 0 and less than or equal to 100')]"
      ),
      amountRangeError: By.xpath(
        "//*[contains(text(),'Enter a number greater than 0 and less than or equal to 100,000')]"
      ),
      quantityError: By.xpath(
        "//*[contains(text(),'Value must be greater than 0')]"
      ),
      maxPerUserError: By.xpath(
        "//*[contains(text(),'Max Quantity per user must less than Max Quantity usage')]"
      ),
      pastDateError: By.xpath(
        "//*[contains(text(),'Please choose date later than current date')]"
      ),
      emailRequiredError: By.xpath(
        "//*[contains(text(),'Please fill out this field')]"
      ),
      emailFormatError: By.xpath(
        "//*[contains(text(),'Please enter a valid email')]"
      ),
      emailNotExistError: By.xpath(
        "//*[contains(text(),'Email does not exist in registered users')]"
      ),
      emailDuplicateError: By.xpath(
        "//*[contains(text(),'Email has already been added')]"
      ),
      apReferralRequiredError: By.xpath(
        "//*[contains(text(),'Please fill out this field')]"
      ),
      apReferralInvalidError: By.xpath(
        "//*[contains(text(),'Invalid referral code')]"
      ),
      packageRequiredError: By.xpath(
        "//*[contains(text(),'Please fill out this field')]"
      ),
      packageNotExistError: By.xpath("//*[contains(text(),'does not exist')]"),
      packageDuplicateError: By.xpath(
        "//*[contains(text(),'already been added')]"
      ),
    };
  }

  // Navigation
  async goto() {
    await this.driver.get(this.createUrl);

    // Check if we were redirected (e.g., to login page)
    const currentUrl = await this.driver.getCurrentUrl();
    if (!currentUrl.includes("/discount/create")) {
      throw new Error(
        `Expected to be on discount create page, but redirected to: ${currentUrl}. Please ensure you are authenticated before calling goto().`
      );
    }

    // Wait for the main form to be visible
    await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.codeInput,
      10000
    );
  }

  // Debug helper to identify available inputs on the page
  async debugFormElements() {
    try {
      console.log("🔍 Debugging form elements...");

      // Find all input elements
      const inputs = await this.driver.findElements(By.xpath("//input"));
      console.log(`Found ${inputs.length} input elements`);

      for (let i = 0; i < Math.min(inputs.length, 10); i++) {
        try {
          const type = await inputs[i].getAttribute("type");
          const name = await inputs[i].getAttribute("name");
          const placeholder = await inputs[i].getAttribute("placeholder");
          const id = await inputs[i].getAttribute("id");
          console.log(
            `Input ${
              i + 1
            }: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`
          );
        } catch (e) {
          console.log(
            `Input ${i + 1}: Error getting attributes - ${e.message}`
          );
        }
      }

      // Find all buttons
      const buttons = await this.driver.findElements(By.xpath("//button"));
      console.log(`Found ${buttons.length} button elements`);

      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        try {
          const text = await buttons[i].getText();
          const type = await buttons[i].getAttribute("type");
          console.log(`Button ${i + 1}: text="${text}", type="${type}"`);
        } catch (e) {
          console.log(
            `Button ${i + 1}: Error getting attributes - ${e.message}`
          );
        }
      }
    } catch (error) {
      console.log("Debug failed:", error.message);
    }
  }

  // Debug helper to examine toggle states specifically
  async debugToggles() {
    try {
      console.log("🔍 Debugging toggle elements...");

      const toggleSelectors = [
        { name: "Public", selector: this.selectors.publicCheckbox },
        {
          name: "Auto Display Trading",
          selector: this.selectors.autoDisplayTradingCheckbox,
        },
        {
          name: "Auto Display Custom",
          selector: this.selectors.autoDisplayCustomCheckbox,
        },
        { name: "Status", selector: this.selectors.statusToggle },
      ];

      for (const toggle of toggleSelectors) {
        try {
          const element = await this.driver.findElement(toggle.selector);
          const classes = await element.getAttribute("class");
          const ariaChecked = await element.getAttribute("aria-checked");
          const text = await element.getText();
          console.log(
            `Toggle ${toggle.name}: class="${classes}", aria-checked="${ariaChecked}", text="${text}"`
          );
        } catch (e) {
          console.log(`Toggle ${toggle.name}: Not found - ${e.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error debugging toggles: ${error.message}`);
    }
  }

  // Getters for form elements
  get codeInput() {
    return this.driver.findElement(this.selectors.codeInput);
  }

  get publicCheckbox() {
    return this.driver.findElement(this.selectors.publicCheckbox);
  }

  get autoDisplayTradingCheckbox() {
    return this.driver.findElement(this.selectors.autoDisplayTradingCheckbox);
  }

  get autoDisplayCustomCheckbox() {
    return this.driver.findElement(this.selectors.autoDisplayCustomCheckbox);
  }

  get percentRadio() {
    return this.driver.findElement(this.selectors.percentRadio);
  }

  get percentageOffInput() {
    return this.driver.findElement(this.selectors.percentageOffInput);
  }

  get maximumAmountInput() {
    return this.driver.findElement(this.selectors.maximumAmountInput);
  }

  get fixedRadio() {
    return this.driver.findElement(this.selectors.fixedRadio);
  }

  get fixedAmountInput() {
    return this.driver.findElement(this.selectors.fixedAmountInput);
  }

  get minInitialBalanceRadio() {
    return this.driver.findElement(this.selectors.minInitialBalanceRadio);
  }

  get minInitialBalanceInput() {
    return this.driver.findElement(this.selectors.minInitialBalanceInput);
  }

  get minAmountRadio() {
    return this.driver.findElement(this.selectors.minAmountRadio);
  }

  get minAmountInput() {
    return this.driver.findElement(this.selectors.minAmountInput);
  }

  get descriptionInput() {
    return this.driver.findElement(this.selectors.descriptionInput);
  }

  get expirationDateInput() {
    return this.driver.findElement(this.selectors.expirationDateInput);
  }

  get specifyQuantityInput() {
    return this.driver.findElement(this.selectors.specifyQuantityInput);
  }

  get maxPerUserInput() {
    return this.driver.findElement(this.selectors.maxPerUserInput);
  }

  get addPackageButton() {
    return this.driver.findElement(this.selectors.addPackageButton);
  }

  get packagePopup() {
    return this.driver.findElement(this.selectors.packagePopup);
  }

  get packageIdInput() {
    return this.driver.findElement(this.selectors.packageIdInput);
  }

  get packageSaveButton() {
    return this.driver.findElement(this.selectors.packageSaveButton);
  }

  get addEmailInput() {
    return this.driver.findElement(this.selectors.addEmailInput);
  }

  get addEmailButton() {
    return this.driver.findElement(this.selectors.addEmailButton);
  }

  get apReferralInput() {
    return this.driver.findElement(this.selectors.apReferralInput);
  }

  get apReferralAddButton() {
    return this.driver.findElement(this.selectors.apReferralAddButton);
  }

  get statusToggle() {
    return this.driver.findElement(this.selectors.statusToggle);
  }

  get cancelButton() {
    return this.driver.findElement(this.selectors.cancelButton);
  }

  get createButton() {
    return this.driver.findElement(this.selectors.createButton);
  }

  get toast() {
    return this.driver.findElement(this.selectors.toast);
  }

  get formErrors() {
    return this.driver.findElements(this.selectors.formErrors);
  }

  // Helper methods
  async fillDiscountCode(value) {
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.codeInput
    );
    await input.clear();
    await input.sendKeys(value);
  }

  async choosePercentageFlow({ percent, maxUSD }) {
    // Select percentage radio if not already selected
    const percentRadio = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.percentRadio
    );
    if (!(await percentRadio.isSelected())) {
      await percentRadio.click();
    }

    // Fill percentage off
    const percentInput = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.percentageOffInput
    );
    await percentInput.clear();
    await percentInput.sendKeys(percent.toString());

    // Fill maximum amount if provided
    if (maxUSD !== undefined) {
      const maxAmountInput = await DriverFactory.waitForClickable(
        this.driver,
        this.selectors.maximumAmountInput
      );
      await maxAmountInput.clear();
      await maxAmountInput.sendKeys(maxUSD.toString());
    }
  }

  async chooseFixedFlow({ amountUSD }) {
    // Select fixed amount radio
    const fixedRadio = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.fixedRadio
    );
    await fixedRadio.click();

    // Fill discount amount
    const amountInput = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.fixedAmountInput
    );
    await amountInput.clear();
    await amountInput.sendKeys(amountUSD.toString());
  }

  async setMinInitialBalance(value) {
    // Select the radio button first
    const radio = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.minInitialBalanceRadio
    );
    await radio.click();

    // Fill the input
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.minInitialBalanceInput
    );
    await input.clear();
    await input.sendKeys(value.toString());
  }

  async setMinAmount(value) {
    // Select the radio button first
    const radio = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.minAmountRadio
    );
    await radio.click();

    // Fill the input
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.minAmountInput
    );
    await input.clear();
    await input.sendKeys(value.toString());
  }

  async setExpiration(dateStrDDMMYYYY) {
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.expirationDateInput
    );
    await input.clear();
    await input.sendKeys(dateStrDDMMYYYY);
  }

  async setQuantities({ total, perUser }) {
    if (total !== undefined) {
      const totalInput = await DriverFactory.waitForClickable(
        this.driver,
        this.selectors.specifyQuantityInput
      );
      await totalInput.clear();
      await totalInput.sendKeys(total.toString());
    }

    if (perUser !== undefined) {
      const perUserInput = await DriverFactory.waitForClickable(
        this.driver,
        this.selectors.maxPerUserInput
      );
      await perUserInput.clear();
      await perUserInput.sendKeys(perUser.toString());
    }
  }

  async addPackageId(pkgIdOrChallengeId) {
    // Open popup
    const addButton = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.addPackageButton
    );
    await addButton.click();

    // Wait for popup and fill package ID
    const packageInput = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.packageIdInput
    );
    await packageInput.sendKeys(pkgIdOrChallengeId);

    // Save
    const saveButton = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.packageSaveButton
    );
    await saveButton.click();

    // Wait for popup to close
    await DriverFactory.waitForGone(this.driver, this.selectors.packagePopup);
  }

  async addEmail(email) {
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.addEmailInput
    );
    await input.sendKeys(email);

    const addButton = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.addEmailButton
    );
    await addButton.click();
  }

  async addApReferral(code) {
    const input = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.apReferralInput
    );
    await input.sendKeys(code);

    const addButton = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.apReferralAddButton
    );
    await addButton.click();
  }

  async toggleAutoDisplayTrading(on) {
    const checkbox = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.autoDisplayTradingCheckbox
    );
    const isChecked = await checkbox.isSelected();
    if (isChecked !== on) {
      await checkbox.click();
    }
  }

  async toggleAutoDisplayCustomized(on) {
    const checkbox = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.autoDisplayCustomCheckbox
    );
    const isChecked = await checkbox.isSelected();
    if (isChecked !== on) {
      await checkbox.click();
    }
  }

  async togglePublic(on) {
    const checkbox = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.publicCheckbox
    );
    const isChecked = await checkbox.isSelected();
    if (isChecked !== on) {
      await checkbox.click();
    }
  }

  async toggleStatus(on) {
    const toggle = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.statusToggle
    );
    const isActive = await toggle.isSelected();
    if (isActive !== on) {
      await toggle.click();
    }
  }

  async submitCreate() {
    const button = await DriverFactory.waitForClickable(
      this.driver,
      this.selectors.createButton
    );
    await button.click();
  }

  async expectToastContains(text) {
    const toast = await DriverFactory.waitForVisible(
      this.driver,
      this.selectors.toast,
      10000
    );
    const toastText = await toast.getText();
    if (!toastText.toLowerCase().includes(text.toLowerCase())) {
      throw new Error(
        `Expected toast to contain "${text}", but got: "${toastText}"`
      );
    }
  }

  async expectInlineErrorNear(fieldLabel, expectedText) {
    // Look for error messages near the field or anywhere in form errors
    const errorElements = await this.driver.findElements(
      this.selectors.formErrors
    );
    let found = false;

    for (const errorElement of errorElements) {
      try {
        const errorText = await errorElement.getText();
        if (errorText.includes(expectedText)) {
          found = true;
          break;
        }
      } catch (e) {
        // Element might be stale, continue
        continue;
      }
    }

    if (!found) {
      // Also check specific error selectors based on the expected text
      const specificSelectors = {
        "Please fill out this field": this.selectors.codeRequiredError,
        "Accept only latin letters": this.selectors.codeFormatError,
        "Only accepted 15 characters": this.selectors.codeLengthError,
        "This code has already been created": this.selectors.codeDuplicateError,
        "Enter a number greater than 0 and less than or equal to 100":
          this.selectors.percentageRangeError,
        "Enter a number greater than 0 and less than or equal to 100,000":
          this.selectors.amountRangeError,
        "Value must be greater than 0": this.selectors.quantityError,
        "Max Quantity per user must less than": this.selectors.maxPerUserError,
        "Please choose date later than current date":
          this.selectors.pastDateError,
        "Please enter a valid email": this.selectors.emailFormatError,
        "Email does not exist": this.selectors.emailNotExistError,
        "Email has already been added": this.selectors.emailDuplicateError,
        "Invalid referral code": this.selectors.apReferralInvalidError,
      };

      for (const [key, selector] of Object.entries(specificSelectors)) {
        if (expectedText.includes(key)) {
          try {
            await DriverFactory.waitForVisible(this.driver, selector, 3000);
            found = true;
            break;
          } catch (e) {
            // Continue to next selector
          }
        }
      }
    }

    if (!found) {
      throw new Error(
        `Expected inline error "${expectedText}" near field "${fieldLabel}", but not found`
      );
    }
  }

  // Utility methods for checking element states
  async isPercentageSelected() {
    const radio = await this.driver.findElement(this.selectors.percentRadio);
    return await radio.isSelected();
  }

  async isFixedSelected() {
    const radio = await this.driver.findElement(this.selectors.fixedRadio);
    return await radio.isSelected();
  }

  // Toggle methods (Ant Design switches using aria-checked)
  async isPublicChecked() {
    try {
      const toggleButton = await this.driver.findElement(
        this.selectors.publicCheckbox
      );
      const ariaChecked = await toggleButton.getAttribute("aria-checked");
      return ariaChecked === "true";
    } catch (error) {
      console.log(`❌ Error checking public toggle state: ${error.message}`);
      return false;
    }
  }

  async isAutoDisplayTradingChecked() {
    try {
      const toggleButton = await this.driver.findElement(
        this.selectors.autoDisplayTradingCheckbox
      );
      const ariaChecked = await toggleButton.getAttribute("aria-checked");
      return ariaChecked === "true";
    } catch (error) {
      console.log(
        `❌ Error checking auto display trading toggle state: ${error.message}`
      );
      return false;
    }
  }

  async isAutoDisplayCustomChecked() {
    try {
      const toggleButton = await this.driver.findElement(
        this.selectors.autoDisplayCustomCheckbox
      );
      const ariaChecked = await toggleButton.getAttribute("aria-checked");
      return ariaChecked === "true";
    } catch (error) {
      console.log(
        `❌ Error checking auto display custom toggle state: ${error.message}`
      );
      return false;
    }
  }

  async isStatusActive() {
    try {
      const toggleButton = await this.driver.findElement(
        this.selectors.statusToggle
      );
      const ariaChecked = await toggleButton.getAttribute("aria-checked");
      return ariaChecked === "true";
    } catch (error) {
      console.log(`❌ Error checking status toggle state: ${error.message}`);
      return false;
    }
  }

  async isElementEnabled(selector) {
    const element = await this.driver.findElement(selector);
    return await element.isEnabled();
  }

  async getFieldValue(selector) {
    const element = await this.driver.findElement(selector);
    return await element.getAttribute("value");
  }
}

export default CreateDiscountPage;
