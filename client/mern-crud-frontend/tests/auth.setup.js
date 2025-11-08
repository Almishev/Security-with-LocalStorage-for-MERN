import { test as setup, expect } from '@playwright/test';

/**
 * This setup file can be used to authenticate once and reuse the authentication state
 * in other tests. This is more efficient than logging in before each test.
 * 
 * To use this, add to playwright.config.js:
 * 
 * projects: [
 *   {
 *     name: 'setup',
 *     testMatch: /.*\.setup\.js/,
 *   },
 *   {
 *     name: 'chromium',
 *     use: { ...devices['Desktop Chrome'] },
 *     dependencies: ['setup'],
 *     use: {
 *       storageState: 'playwright/.auth/user.json',
 *     },
 *   },
 * ]
 */

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in credentials
  // NOTE: You need to have a test user in your database
  // Replace these with your test user credentials
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'test123');
  
  // Submit login form
  await page.click('button[type="submit"]');
  
  // Wait for successful login (redirect to /employee)
  await page.waitForURL(/.*employee/, { timeout: 5000 });
  
  // Verify we're logged in by checking for employee page elements
  // or checking localStorage for token
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});

