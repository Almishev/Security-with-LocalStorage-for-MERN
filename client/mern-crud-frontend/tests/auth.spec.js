import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access protected employee page
    await page.goto('/employee');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing profile without auth', async ({ page }) => {
    // Try to access profile page
    await page.goto('/profile');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing add employee without auth', async ({ page }) => {
    // Try to access add employee page
    await page.goto('/add');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('login form validation', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    // Check if email field has required attribute
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('register form validation', async ({ page }) => {
    await page.goto('/register');
    
    // Check if all required fields exist
    await expect(page.locator('input[name="userName"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('required', '');
  });
});

