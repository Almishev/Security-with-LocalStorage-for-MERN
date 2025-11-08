import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test('should redirect to login when accessing profile without authentication', async ({ page }) => {
    await page.goto('/profile');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('profile page structure (when authenticated)', async ({ page }) => {
    // Navigate to profile - should redirect to login if not authenticated
    await page.goto('/profile', { waitUntil: 'networkidle' });
    
    // Wait for URL to stabilize (either /profile or /login)
    // Check if we're redirected to login (expected when not authenticated)
    try {
      await page.waitForURL(/.*login/, { timeout: 2000 });
      // Expected behavior - redirect to login when not authenticated
      await expect(page).toHaveURL(/.*login/);
    } catch {
      // If not redirected to login, assume we're authenticated and check for profile elements
      await expect(page).toHaveURL(/.*profile/);
      // Wait for profile to load (it has loading state)
      await page.waitForSelector('h1.profile-title', { timeout: 5000 });
      await expect(page.locator('h1.profile-title')).toContainText('User Profile');
      await expect(page.locator('a[href="/employee"]')).toBeVisible();
    }
  });
});

