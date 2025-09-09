import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

class DriverFactory {
  static async createDriver() {
    const options = new chrome.Options();

    // Configure Chrome options
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--disable-features=VizDisplayCompositor");
    options.addArguments("--disable-features=IsolateOrigins,site-per-process");

    // Set headless mode based on environment variable
    const isHeadless = process.env.HEADLESS === "true";
    if (isHeadless) {
      options.addArguments("--headless=new");
    }

    // Let Selenium Manager resolve the right ChromeDriver for installed Chrome
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    // Set default timeouts
    await driver.manage().setTimeouts({
      implicit: 10000, // 10 seconds
      pageLoad: 60000, // 60 seconds - staging can be slow
      script: 60000, // 60 seconds
    });

    return driver;
  }

  /**
   * Wait for an element to be visible and displayed
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {By} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @returns {Promise<WebElement>}
   */
  static async waitForVisible(driver, locator, timeout = 10000) {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  /**
   * Wait for an element to disappear
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {By} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @returns {Promise<boolean>}
   */
  static async waitForGone(driver, locator, timeout = 10000) {
    try {
      await driver.wait(
        until.stalenessOf(await driver.findElement(locator)),
        timeout
      );
      return true;
    } catch (error) {
      // Element might not exist, which is also "gone"
      return true;
    }
  }

  /**
   * Wait for URL to contain specific text
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {string} text - Text that should be in the URL
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @returns {Promise<boolean>}
   */
  static async waitUrlContains(driver, text, timeout = 10000) {
    return await driver.wait(until.urlContains(text), timeout);
  }

  /**
   * Wait for URL to NOT contain specific text
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {string} text - Text that should NOT be in the URL
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @returns {Promise<boolean>}
   */
  static async waitUrlNotContains(driver, text, timeout = 10000) {
    return await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return !currentUrl.includes(text);
    }, timeout);
  }

  /**
   * Wait for an element to be clickable (visible and enabled)
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {By} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @returns {Promise<WebElement>}
   */
  static async waitForClickable(driver, locator, timeout = 10000) {
    const element = await this.waitForVisible(driver, locator, timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Safe click that waits for element to be clickable
   * @param {WebDriver} driver - Selenium WebDriver instance
   * @param {By} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  static async safeClick(driver, locator, timeout = 10000) {
    const element = await this.waitForClickable(driver, locator, timeout);
    await element.click();
  }
}

export { By, DriverFactory, until };

// Legacy export for createDriver function
export const createDriver = DriverFactory.createDriver;
