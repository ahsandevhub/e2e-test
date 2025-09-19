import { By } from "selenium-webdriver";

export default class DiscountPage {
  constructor(driver) {
    this.driver = driver;
    this.selectors = {
      discountCodeInput: By.css("input#code"),
      percentageDiscountRadio: By.css('input[type="radio"][value="1"]'),
      fixedAmountDiscountRadio: By.css('input[type="radio"][value="2"]'),
      percentageOffInput: By.css("input#percentageOff"),
      maximumAmountInput: By.css("input#maximumDiscountAmount"),
      // Fixed-amount field appears only when its radio is selected; tolerate id/name variants
      discountAmountInput: By.css(
        'input#discountAmount, input[placeholder*="Discount Amount"], input[id*="discountAmount"]'
      ),
      publicToUserCheckbox: By.css("button#isPublicToUser"),
      activeToggle: By.css("button#isActive"),
      tradingCapAutoDisplay: By.css("button#isDisplayForTradingCapital"),
      customizePkgAutoDisplay: By.css("button#isDisplayForCustomizePackage"),
      specificQuantityInput: By.css("input#specificQuantity"),
      descriptionInput: By.css("textarea#description"),
      expirationDateInput: By.css("input#expirationDate"),
      submitButton: By.xpath(
        // Accept both "Add" and "Create" labels across builds
        '//button[contains(@class,"ant-btn-primary")][.//span[normalize-space()="Add" or normalize-space()="Create"]]'
      ),
      errorMessage: By.css(
        ".ant-form-item-explain-error, .ant-form-item-explain"
      ),
      successToast: By.css(
        ".ant-notification-notice-message, .ant-message-success"
      ),
    };
  }

  async clearAllFields() {
    // Clear discount code
    try {
      await this.driver.findElement(this.selectors.discountCodeInput).clear();
    } catch (e) {}

    // Clear percentage fields if visible
    try {
      await this.driver.findElement(this.selectors.percentageOffInput).clear();
    } catch (e) {}

    try {
      await this.driver.findElement(this.selectors.maximumAmountInput).clear();
    } catch (e) {}

    // Clear other optional fields
    try {
      await this.driver
        .findElement(this.selectors.specificQuantityInput)
        .clear();
    } catch (e) {}

    try {
      await this.driver.findElement(this.selectors.descriptionInput).clear();
    } catch (e) {}
  }

  async fillRequiredFields(code = null, percentage = 10, maxAmount = 100) {
    // Fill discount code
    const discountCode = code || `TEST${Date.now()}`.slice(0, 15);
    await this.fillDiscountCode(discountCode);

    // Select percentage discount and fill amounts
    await this.selectPercentageDiscount();
    await this.fillPercentageOff(percentage);
    await this.fillMaximumAmount(maxAmount);

    // Fill minimum values fields that are visible in the screenshot
    try {
      // Try different possible selectors for minimum initial balance
      let minimumInitialBalance = await this.driver.findElements(
        By.css('input[placeholder*="Minimum Initial Balance"]')
      );
      if (minimumInitialBalance.length === 0) {
        minimumInitialBalance = await this.driver.findElements(
          By.css('input[id*="minimumInitialBalance"]')
        );
      }
      if (minimumInitialBalance.length === 0) {
        minimumInitialBalance = await this.driver.findElements(
          By.xpath(
            '//label[contains(text(),"Minimum Initial Balance")]/..//input'
          )
        );
      }

      if (minimumInitialBalance.length > 0) {
        await this.driver.executeScript(
          "arguments[0].scrollIntoView();",
          minimumInitialBalance[0]
        );
        await this.driver.sleep(200);
        await minimumInitialBalance[0].clear();
        await minimumInitialBalance[0].sendKeys("100");
        console.log("✅ Filled minimum initial balance: 100");
      }
    } catch (e) {
      console.log("⚠️ Could not find/fill minimum initial balance:", e.message);
    }

    try {
      // Try different possible selectors for minimum amount
      let minimumAmount = await this.driver.findElements(
        By.css('input[placeholder*="Minimum Amount"]')
      );
      if (minimumAmount.length === 0) {
        minimumAmount = await this.driver.findElements(
          By.css('input[id*="minimumAmount"]')
        );
      }
      if (minimumAmount.length === 0) {
        minimumAmount = await this.driver.findElements(
          By.xpath('//label[contains(text(),"Minimum Amount")]/..//input')
        );
      }

      if (minimumAmount.length > 0) {
        await this.driver.executeScript(
          "arguments[0].scrollIntoView();",
          minimumAmount[0]
        );
        await this.driver.sleep(200);
        await minimumAmount[0].clear();
        await minimumAmount[0].sendKeys("50");
        console.log("✅ Filled minimum amount: 50");
      }
    } catch (e) {
      console.log("⚠️ Could not find/fill minimum amount:", e.message);
    }

    // Fill description field if it exists (might be required)
    try {
      const description = await this.driver.findElements(
        this.selectors.descriptionInput
      );
      if (description.length > 0) {
        await this.driver.executeScript(
          "arguments[0].scrollIntoView();",
          description[0]
        );
        await this.driver.sleep(200);
        await description[0].clear();
        await description[0].sendKeys("Test discount created by automation");
        console.log("✅ Filled description");
      }
    } catch (e) {
      console.log("⚠️ Could not find/fill description:", e.message);
    }

    return discountCode;
  }

  async fillDiscountCode(code) {
    const input = await this.driver.findElement(
      this.selectors.discountCodeInput
    );
    await input.clear();
    await input.sendKeys(code);
  }

  async getDiscountCodeValue() {
    const input = await this.driver.findElement(
      this.selectors.discountCodeInput
    );
    return await input.getAttribute("value");
  }

  async selectPercentageDiscount() {
    const radio = await this.driver.findElement(
      this.selectors.percentageDiscountRadio
    );
    await radio.click();
  }

  async selectFixedAmountDiscount() {
    const radio = await this.driver.findElement(
      this.selectors.fixedAmountDiscountRadio
    );
    await radio.click();
  }

  async fillPercentageOff(value) {
    const input = await this.driver.findElement(
      this.selectors.percentageOffInput
    );
    await input.clear();
    await input.sendKeys(value.toString());
  }

  async fillMaximumAmount(value) {
    const input = await this.driver.findElement(
      this.selectors.maximumAmountInput
    );
    await input.clear();
    await input.sendKeys(value.toString());
  }

  async fillDiscountAmount(value) {
    // First ensure Fixed Amount Discount is selected to make the field visible
    await this.selectFixedAmountDiscount();
    await this.driver.sleep(500); // Wait for UI to update

    // Look for a discount amount input that appears when fixed amount is selected
    const input = await this.driver.findElement(
      this.selectors.discountAmountInput
    );
    await input.clear();
    await input.sendKeys(value.toString());
  }

  async setPublicToUser(checked) {
    const toggle = await this.driver.findElement(
      this.selectors.publicToUserCheckbox
    );
    const isChecked = (await toggle.getAttribute("aria-checked")) === "true";
    if (isChecked !== checked) {
      await toggle.click();
    }
  }

  async setActive(checked) {
    const toggle = await this.driver.findElement(this.selectors.activeToggle);
    const isChecked = (await toggle.getAttribute("aria-checked")) === "true";
    if (isChecked !== checked) {
      await toggle.click();
    }
  }

  async submit() {
    try {
      const button = await this.driver.findElement(this.selectors.submitButton);

      // Scroll to button and ensure it's visible
      await this.driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        button
      );
      await this.driver.sleep(300);

      // Check if button is enabled and clickable
      const isEnabled = await button.isEnabled();
      const isDisplayed = await button.isDisplayed();
      const disabled = await button.getAttribute("disabled");

      console.log(
        `Button state - enabled: ${isEnabled}, displayed: ${isDisplayed}, disabled attr: ${disabled}`
      );

      if (!isEnabled || disabled !== null) {
        console.log("⚠️ Submit button appears disabled, waiting...");
        await this.driver.sleep(1000);
      }

      // Try normal click first
      await button.click();
      console.log("✅ Submit button clicked successfully");
    } catch (e) {
      console.log(
        "⚠️ Normal click failed, trying JavaScript click:",
        e.message
      );
      // If clicking fails, try JavaScript click
      const button = await this.driver.findElement(this.selectors.submitButton);
      await this.driver.executeScript("arguments[0].click();", button);
      console.log("✅ JavaScript click executed");
    }
  }

  async pageHasErrorText(regex) {
    const nodes = await this.driver.findElements(this.selectors.errorMessage);
    for (const n of nodes) {
      const t = (await n.getText()) || "";
      if (regex.test(t)) return true;
    }
    return false;
  }

  async fillExpirationDate(ddmmyyyyDigits) {
    try {
      // Ant DatePicker input accepts typing; UI auto-inserts slashes
      const el = await this.driver.findElement(
        this.selectors.expirationDateInput
      );
      await this.driver.executeScript("arguments[0].scrollIntoView();", el);
      await this.driver.sleep(300);
      await el.clear();
      await this.driver.sleep(300);
      await el.sendKeys(ddmmyyyyDigits); // e.g. "01012030" -> 01/01/2030
      await this.driver.sleep(300);
    } catch (e) {
      console.log("Failed to fill expiration date:", e.message);
      throw e;
    }
  }

  makeRelativeDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }

  async hasFieldError(field) {
    try {
      // Look for validation errors near specific fields
      let selector;
      if (field === "discountCode") {
        selector = By.xpath(
          '//input[@id="code"]/ancestor::div[contains(@class,"ant-form-item")]//div[contains(@class,"ant-form-item-explain")]'
        );
      } else if (field === "percentageOff") {
        selector = By.xpath(
          '//input[@id="percentageOff"]/ancestor::div[contains(@class,"ant-form-item")]//div[contains(@class,"ant-form-item-explain")]'
        );
      } else {
        selector = By.css(
          ".ant-form-item-explain-error, .ant-form-item-explain"
        );
      }
      const errors = await this.driver.findElements(selector);
      return errors.length > 0;
    } catch (e) {
      return false;
    }
  }

  async getFieldError(field) {
    try {
      let selector;
      if (field === "discountCode") {
        selector = By.xpath(
          '//input[@id="code"]/ancestor::div[contains(@class,"ant-form-item")]//div[contains(@class,"ant-form-item-explain")]'
        );
      } else if (field === "percentageOff") {
        selector = By.xpath(
          '//input[@id="percentageOff"]/ancestor::div[contains(@class,"ant-form-item")]//div[contains(@class,"ant-form-item-explain")]'
        );
      } else {
        selector = By.css(
          ".ant-form-item-explain-error, .ant-form-item-explain"
        );
      }
      const errors = await this.driver.findElements(selector);
      if (errors.length > 0) {
        return await errors[0].getText();
      }
      return "";
    } catch (e) {
      return "";
    }
  }

  async isOnEditDiscountPage() {
    const url = await this.driver.getCurrentUrl();
    return url.includes("/discount/edit");
  }
}
