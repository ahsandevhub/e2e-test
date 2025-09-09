import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Global timeout for all tests (60 seconds)
    testTimeout: 120000, // 120s for end-to-end

    // Hook timeout for setup/teardown
    hookTimeout: 90000, // give beforeAll enough time to boot browser

    // mark slow tests for visibility
    slowTestThreshold: 30000,

    // Run tests sequentially (important for E2E tests with shared browser state)
    sequence: {
      concurrent: false,
    },

    // File patterns
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".git"],

    // Reporter configuration
    reporter: ["verbose"],

    // Coverage (optional, not needed for E2E)
    coverage: {
      enabled: false,
    },

    // Global setup/teardown files (if needed)
    // globalSetup: './tests/global-setup.js',
    // globalTeardown: './tests/global-teardown.js',

    // Retry failed tests
    retry: 1,

    // Bail after first failure in CI
    bail: process.env.CI ? 1 : 0,
  },

  // Enable ES modules
  esbuild: {
    target: "node18",
  },
});
