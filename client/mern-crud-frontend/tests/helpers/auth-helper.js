/**
 * Helper functions for authentication in tests
 */

/**
 * Login as a user
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} email - User email
 * @param {string} password - User password
 */
export async function loginAsUser(page, email, password) {
  await page.goto('/login', { waitUntil: 'networkidle' });
  
  // Wait for form to be ready
  await page.waitForSelector('input[type="email"]', { state: 'visible' });
  await page.waitForSelector('input[type="password"]', { state: 'visible' });
  
  // Clear any existing values
  await page.fill('input[type="email"]', '');
  await page.fill('input[type="password"]', '');
  
  // Fill form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit form
  const [response] = await Promise.all([
    page.waitForResponse(
      response => response.url().includes('/auth/login'),
      { timeout: 10000 }
    ).catch(() => null),
    page.click('button[type="submit"]')
  ]);
  
  // Wait a bit for any navigation or error messages
  await page.waitForTimeout(2000);
  
  // Check response status if we got one
  if (response) {
    if (response.status() !== 200) {
      let responseBody;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = { message: 'Could not parse response' };
      }
      const errorMsg = responseBody.message || responseBody.error || 'Check credentials';
      throw new Error(`Login failed with status ${response.status()}. Backend says: "${errorMsg}". Email used: ${email}`);
    }
  }
  
  // Wait for navigation after login (either to /employee or stay on /login if failed)
  try {
    await page.waitForURL(/.*employee/, { timeout: 5000 });
    // Success - we're on employee page
    return;
  } catch {
    // Check if we're still on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // Check for error toast messages
      const toastError = await page.locator('[role="alert"], .toast-error, [class*="error"]').first().textContent().catch(() => null);
      const pageError = await page.locator('text=/invalid|error|failed|wrong/i').first().textContent().catch(() => null);
      const errorMsg = toastError || pageError || 'Unknown error';
      throw new Error(`Login failed - still on login page. Error: ${errorMsg}. Email: ${email}`);
    }
    // If we're not on login and not on employee, might be a different page - consider it success
  }
}

/**
 * Login as admin user
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function loginAsAdmin(page) {
  // Test admin credentials
  // Note: If login fails, check:
  // 1. Email is correct (might need full domain like t.toni@abv.bg)
  // 2. Password is correct
  // 3. User has 'admin' role in database
  const adminEmail = process.env.TEST_ADMIN_EMAIL || 't.toni@abv';
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || '123456';
  
  try {
    await loginAsUser(page, adminEmail, adminPassword);
  } catch (error) {
    // If login fails, try with .bg domain
    if (adminEmail === 't.toni@abv' && !adminEmail.includes('.bg')) {
      console.log('Trying with .bg domain extension...');
      try {
        await loginAsUser(page, 't.toni@abv.bg', adminPassword);
        return;
      } catch {
        // Continue with original error
      }
    }
    throw error;
  }
}

/**
 * Login as regular user (non-admin)
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function loginAsRegularUser(page) {
  // Test user credentials
  const userEmail = process.env.TEST_USER_EMAIL || 'petq@abv.bg';
  const userPassword = process.env.TEST_USER_PASSWORD || '123456';
  
  await loginAsUser(page, userEmail, userPassword);
}

/**
 * Check if user is authenticated by checking localStorage for token
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  return !!token;
}

/**
 * Logout user
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function logout(page) {
  await page.evaluate(() => {
    localStorage.removeItem('token');
  });
  await page.goto('/login');
}

