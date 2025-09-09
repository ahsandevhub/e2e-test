import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import DashboardPage from "../pages/DashboardPage.js";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.js";
import LoginPage from "../pages/LoginPage.js";
import { DriverFactory } from "../utils/driver.js";

// Load environment variables
dotenv.config();

describe("WeMasterTrade Back Office Authentication Tests", () => {
  let driver;
  let loginPage;
  let dashboardPage;
  let forgotPasswordPage;

  // Helper: ensure we're at the login page (log out if needed)
  async function ensureAtLogin() {
    try {
      await driver.get(process.env.LOGIN_URL);
      await DriverFactory.waitForVisible(
        driver,
        loginPage.selectors.usernameInput,
        5000
      );
      return;
    } catch (_) {
      // If already logged in, perform logout
      try {
        await dashboardPage.logout();
      } catch (_) {
        // Fallback: navigate directly to login URL
        await driver.get(process.env.LOGIN_URL);
      }
      // Wait for login controls
      await DriverFactory.waitForVisible(
        driver,
        loginPage.selectors.usernameInput,
        8000
      );
    }
  }

  // Setup before running tests
  beforeAll(async () => {
    driver = await DriverFactory.createDriver();
    loginPage = new LoginPage(driver);
    dashboardPage = new DashboardPage(driver);
    forgotPasswordPage = new ForgotPasswordPage(driver);
  }, 90000);

  // Cleanup after all tests
  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("Authentication Tests", () => {
    it("1. should show validation errors for empty fields", async () => {
      // Ensure we're at the login page
      await ensureAtLogin();

      // Try to submit empty form
      await loginPage.submit();

      // Wait a moment for validation
      await driver.sleep(2000);

      // Check for validation errors
      const hasValidationErrors = await loginPage.hasValidationErrors();

      if (!hasValidationErrors) {
        console.log("⚠️ No validation errors found, debugging...");
        await loginPage.debugValidationErrors();
      }

      expect(hasValidationErrors).toBe(true);

      console.log("✅ Validation errors displayed for empty fields");
    }, 30000);

    it("2. should show error for invalid credentials", async () => {
      // Ensure we're at the login page
      await ensureAtLogin();

      // Attempt login with invalid credentials
      await loginPage.login("invalid@email.com", "wrongpassword");

      // Wait a moment for error message to appear
      await driver.sleep(3000);

      // Check current URL to ensure we're still on login page or redirected back
      const currentUrl = await driver.getCurrentUrl();
      console.log("Current URL after invalid login:", currentUrl);

      // If we're redirected, we might need to check for different error patterns
      if (
        currentUrl.includes("/auth/login") ||
        currentUrl.includes("/admin/login")
      ) {
        // Check for error message
        const hasError = await loginPage.hasErrorMessage();
        expect(hasError).toBe(true);

        if (hasError) {
          const errorMessage = await loginPage.getErrorMessage();
          console.log("✅ Error message displayed:", errorMessage);
        }
      } else {
        // If redirected elsewhere, that could also indicate failed login
        console.log("✅ Invalid login redirected to:", currentUrl);
        // Ensure we're back at login for next test
        await ensureAtLogin();
      }
    }, 30000);

    it("3. should successfully login with valid credentials and redirect to dashboard", async () => {
      // Verify we have required environment variables
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set"
        );
      }

      // Ensure we're at the login page
      await ensureAtLogin();

      // Perform login
      await loginPage.login(adminEmail, adminPassword);

      // Verify successful login by checking dashboard
      await dashboardPage.expectLoaded();

      // Verify URL contains dashboard URL
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain(process.env.DASHBOARD_URL);

      console.log("✅ Login successful - redirected to dashboard");
    }, 60000);

    it("4. should successfully logout and redirect to login page", async () => {
      // Ensure we're logged in (from previous test)
      const isLoggedIn = await dashboardPage.isUserLoggedIn();

      if (!isLoggedIn) {
        // Login first if not already logged in
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        await ensureAtLogin();
        await loginPage.login(adminEmail, adminPassword);
        await dashboardPage.expectLoaded();
      }

      // Perform logout
      await dashboardPage.logout();

      // Verify redirect to logout success URL
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain(process.env.LOGOUT_SUCCESS_URL);

      console.log("✅ Logout successful - redirected to login page");
    }, 60000);

    it("5. should navigate to forgot password page", async () => {
      // Ensure we're at the login page
      await ensureAtLogin();

      // Click forgot password link
      await loginPage.clickForgotPassword();

      // Verify URL contains forgot password path
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain(process.env.FORGOT_PASSWORD_URL);

      console.log("✅ Successfully navigated to forgot password page");
    }, 30000);

    it("6. should show validation error for invalid email format on forgot password", async () => {
      // Navigate to forgot password page via login page
      await ensureAtLogin();
      await loginPage.clickForgotPassword();

      // Wait for forgot password page to load
      await driver.sleep(1000);

      // Fill invalid email format but don't submit yet
      await forgotPasswordPage.fillEmail("administrator.bo");

      // Wait a moment for validation to trigger
      await driver.sleep(1000);

      // Try to submit (button might be disabled, but validation should show)
      try {
        await forgotPasswordPage.submit();
      } catch (error) {
        // Button might be disabled, that's expected for invalid email
        console.log("Submit button disabled for invalid email (expected)");
      }

      // Wait for validation error
      await driver.sleep(1000);

      // Check for validation error
      const hasValidation = await forgotPasswordPage.hasValidationError();
      const validationMessage = await forgotPasswordPage.getValidationError();

      console.log("Has validation error:", hasValidation);
      console.log("Validation message:", validationMessage);

      // Should show email validation error
      expect(hasValidation).toBe(true);
      expect(validationMessage.toLowerCase()).toContain("valid email");

      console.log(
        "✅ Forgot password shows validation error for invalid email format"
      );
    }, 30000);

    it("7. should show error for non-existent email on forgot password", async () => {
      // Navigate to forgot password page via login page (like test 5)
      await ensureAtLogin();
      await loginPage.clickForgotPassword();

      // Wait for forgot password page to load
      await driver.sleep(1000);

      // Submit a non-existent email
      await forgotPasswordPage.requestReset("nonexistent@example.com");

      // Wait for error message
      await driver.sleep(2000);

      // Check for error message
      const errorMessage = await forgotPasswordPage.getErrorMessage();
      console.log("Error message:", errorMessage);

      // Should show "User not found" error
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.toLowerCase()).toContain("user not found");

      console.log("✅ Forgot password shows error for non-existent email");
    }, 30000);
  });
});
