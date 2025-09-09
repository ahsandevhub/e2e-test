# WeMasterTrade Back Office E2E Tests

This project provides comprehensive end-to-end (E2E) testing for the WeMasterTrade Back Office authentication system. It uses Selenium WebDriver, Vitest, and follows the Page Object Model (POM) pattern for maintainable and robust test automation.

## 🚀 Features

- **Complete Authentication Testing**: Login, logout, forgot password, and validation flows
- **Environment-Driven Configuration**: All URLs and credentials loaded from `.env` file
- **Ant Design Optimized**: Selectors specifically designed for Ant Design components
- **Client & Server-Side Validation**: Tests both frontend validation and backend error responses
- **Robust Error Handling**: Comprehensive error message detection and validation
- **Debug-Friendly**: Detailed logging and configurable headless/headful browser modes

## 📁 Project Structure

```
e2e-test/
├── package.json              # Dependencies and scripts
├── vitest.config.js          # Vitest test runner configuration
├── .env                      # Environment variables (not committed)
├── .env.example              # Example environment configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
├── utils/
│   └── driver.js             # WebDriver factory and utility functions
├── pages/
│   ├── LoginPage.js          # Login page object model
│   ├── DashboardPage.js      # Dashboard page object model
│   └── ForgotPasswordPage.js # Forgot password page object model
└── tests/
    └── auth.spec.js          # Complete authentication test suite
```

## 🧪 Test Coverage

The test suite includes 7 comprehensive authentication tests:

1. **Empty Field Validation** - Ensures client-side validation for required fields
2. **Invalid Credentials** - Tests error handling for wrong email/password
3. **Successful Login** - Verifies proper authentication and dashboard redirect
4. **Logout Functionality** - Tests user logout and return to login page
5. **Forgot Password Navigation** - Verifies forgot password link navigation
6. **Email Format Validation** - Tests email validation on forgot password form
7. **User Not Found Error** - Tests error handling for non-existent email addresses

## 🛠️ Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Create environment configuration:**
```bash
cp .env.example .env
```

3. **Edit `.env` with your test environment details:**
```properties
# Authentication Credentials
ADMIN_EMAIL=administrator.bo@yopmail.com
ADMIN_PASSWORD=Z1ybVvf202rR

# Browser Configuration
HEADLESS=false

# Application URLs
BASE_URL=https://stg1-admin.wemastertrade.com
LOGIN_URL=https://stg1-admin.wemastertrade.com/auth/login
FORGOT_PASSWORD_URL=https://stg1-admin.wemastertrade.com/auth/forgot-password
DASHBOARD_URL=https://stg1-admin.wemastertrade.com/
LOGOUT_SUCCESS_URL=https://stg1-admin.wemastertrade.com/auth/login
```

## ▶️ Running Tests

### Run All Tests
```bash
npm test
```

### Run with Visible Browser (for debugging)
```bash
HEADLESS=false npm test
```

### Run Specific Test
```bash
npx vitest run tests/auth.spec.js -t "should successfully login"
```

### Run with Verbose Output
```bash
npx vitest run --reporter=verbose
```

## 🏗️ Architecture

### Page Object Model (POM)
Each page is represented by a class that encapsulates:
- **Selectors**: XPath selectors optimized for Ant Design components
- **Actions**: Methods for user interactions (click, type, submit)
- **Validations**: Methods for checking page state and error messages

### WebDriver Utilities
The `driver.js` utility provides:
- **Driver Factory**: Consistent Chrome WebDriver configuration
- **Wait Helpers**: Robust waiting mechanisms for dynamic content
- **Error Handling**: Graceful handling of timeout and element issues

### Environment Configuration
All test data and URLs are externalized to `.env` for:
- **Security**: Credentials not stored in code
- **Flexibility**: Easy switching between environments
- **CI/CD Ready**: Environment-specific configuration support

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Admin user email for testing | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin user password | `SecurePassword123` |
| `HEADLESS` | Run browser in headless mode | `true` or `false` |
| `BASE_URL` | Application base URL | `https://app.example.com` |
| `LOGIN_URL` | Login page URL | `https://app.example.com/auth/login` |
| `FORGOT_PASSWORD_URL` | Forgot password page URL | `https://app.example.com/auth/forgot-password` |
| `DASHBOARD_URL` | Dashboard URL after login | `https://app.example.com/dashboard` |
| `LOGOUT_SUCCESS_URL` | URL after successful logout | `https://app.example.com/auth/login` |

### Browser Configuration
- **Chrome**: Uses Chrome browser with Selenium Manager
- **Timeouts**: 10s implicit, 60s page load, 60s script execution
- **Window Size**: 1920x1080 for consistent screenshots
- **Options**: No sandbox, disabled GPU for CI/CD compatibility

## 🐛 Debugging

### Common Issues and Solutions

**Element Not Found:**
- Check if selectors match current DOM structure
- Verify page has loaded completely
- Update XPath selectors in page objects

**Timeout Errors:**
- Increase wait timeouts in `driver.js`
- Check network connectivity and page load times
- Verify target elements are actually rendered

**Authentication Failures:**
- Verify credentials in `.env` file are correct
- Check if test environment is accessible
- Ensure URLs point to correct environment

### Debug Mode
Run tests with visible browser to observe behavior:
```bash
HEADLESS=false npm test
```

## 🚦 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
        env:
          HEADLESS: true
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

## 📚 Extending Tests

### Adding New Tests
1. Create test methods in `auth.spec.js`
2. Follow existing naming convention
3. Use page object methods for interactions
4. Include proper assertions and logging

### Adding New Pages
1. Create new page class in `pages/` directory
2. Follow POM pattern with selectors and methods
3. Import and initialize in test files
4. Add comprehensive error handling

### Updating Selectors
1. Use XPath for flexibility with dynamic content
2. Prefer text-based selectors for stability
3. Include multiple fallback selectors
4. Test selector changes thoroughly

## 🤝 Contributing

1. Follow existing code style and patterns
2. Add tests for new functionality
3. Update documentation for changes
4. Ensure all tests pass before committing

## 📄 License

This project is for internal use at WeMasterTrade.

---

**Happy Testing!** 🧪✨

For questions or support, please contact the development team.
