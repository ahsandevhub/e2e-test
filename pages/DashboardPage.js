import dotenv from "dotenv";
import { By, DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

class DashboardPage {
  constructor(driver) {
    this.driver = driver;
    this.dashboardUrl = process.env.DASHBOARD_URL;

    // Selectors - optimized for Ant Design
    this.selectors = {
      // Main navigation elements
      sidebarContainer: By.xpath(
        "//aside | //div[contains(@class,'ant-layout-sider')]"
      ),
      leftNavigation: By.xpath(
        "//nav | //div[contains(@class,'ant-menu')] | //aside"
      ),
      systemManagementNav: By.xpath(
        "//*[contains(text(), 'System Management')]"
      ),
      discountNav: By.xpath("//*[contains(text(), 'Discount')]"),
      questNav: By.xpath("//*[contains(text(), 'Quest')]"),
      blindBoxNav: By.xpath("//*[contains(text(), 'Blind Box')]"),

      // User menu elements
      userAvatar: By.xpath(
        "//img[contains(@class, 'avatar')] | //*[contains(@class, 'user-menu')] | //header//*[contains(text(), 'SuperAdmin') or contains(text(), 'Admin')]"
      ),
      userMenuButton: By.xpath(
        "//header//*[contains(@class,'avatar') or contains(@class,'user')] | //header//*[contains(text(),'SuperAdmin') or contains(text(),'Admin')]"
      ),
      userDropdownMenu: By.xpath(
        "//*[contains(@class, 'ant-dropdown')] | //*[@role='menu']"
      ),
      logoutMenuItem: By.xpath(
        "//a[normalize-space()='Logout' or normalize-space()='Log out'] | //button[normalize-space()='Logout'] | //*[contains(text(), 'Logout')]"
      ),

      // Dashboard indicators
      dashboardIndicator: By.xpath(
        "//header | //aside | //div[contains(@class,'ant-layout')]"
      ),
    };
  }

  /**
   * Verify the dashboard page has loaded successfully
   */
  async expectLoaded() {
    // Wait for URL to contain dashboard path
    await DriverFactory.waitUrlContains(this.driver, this.dashboardUrl);

    // Check for navigation elements
    let hasNavigation = false;
    const navCandidates = [
      this.selectors.systemManagementNav,
      this.selectors.discountNav,
      this.selectors.questNav,
      this.selectors.blindBoxNav,
      this.selectors.sidebarContainer,
    ];

    for (const locator of navCandidates) {
      try {
        await DriverFactory.waitForVisible(this.driver, locator, 5000);
        hasNavigation = true;
        break;
      } catch (_) {
        // try next
      }
    }

    if (!hasNavigation) {
      throw new Error(
        "Dashboard navigation elements not found - login may have failed"
      );
    }

    return true;
  }

  /**
   * Open the user menu (avatar/profile dropdown)
   */
  async openUserMenu() {
    try {
      const userMenu = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.userMenuButton,
        5000
      );
      await userMenu.click();

      // Wait for dropdown to appear
      await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.userDropdownMenu,
        3000
      );
    } catch (error) {
      console.warn("Could not open user menu:", error.message);
      throw error;
    }
  }

  /**
   * Perform logout
   */
  async logout() {
    try {
      // Open user menu first
      await this.openUserMenu();

      // Click logout
      const logoutItem = await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.logoutMenuItem,
        5000
      );
      await logoutItem.click();

      // Wait for redirect to logout success URL
      await DriverFactory.waitUrlContains(
        this.driver,
        process.env.LOGOUT_SUCCESS_URL,
        10000
      );
    } catch (error) {
      console.warn("Logout failed:", error.message);
      throw error;
    }
  }

  /**
   * Check if dashboard is currently loaded
   */
  async isLoaded() {
    try {
      const currentUrl = await this.driver.getCurrentUrl();
      return currentUrl.includes(this.dashboardUrl);
    } catch (error) {
      return false;
    }
  }

  /**
   * Navigate to dashboard
   */
  async open() {
    await this.driver.get(this.dashboardUrl);
    await this.expectLoaded();
  }

  /**
   * Check if user is logged in by checking for navigation elements
   */
  async isUserLoggedIn() {
    try {
      await DriverFactory.waitForVisible(
        this.driver,
        this.selectors.sidebarContainer,
        3000
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default DashboardPage;
