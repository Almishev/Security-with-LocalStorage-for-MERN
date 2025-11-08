import { test, expect } from '@playwright/test';

test('homepage redirects to login', async ({ page }) => {
  await page.goto('/');
  
  // Should redirect to login page
  await expect(page).toHaveURL(/.*login/);
});

test('login page is accessible and has form fields', async ({ page }) => {
  await page.goto('/login');
  
  // Check if email input is visible
  await expect(page.locator('input[type="email"]')).toBeVisible();
  
  // Check if password input is visible
  await expect(page.locator('input[type="password"]')).toBeVisible();
  
  // Check if login button exists
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  
  // Check if register link exists
  await expect(page.locator('a[href="/register"]')).toBeVisible();
});

test('register page is accessible and has form fields', async ({ page }) => {
  await page.goto('/register');
  
  // Check if username input is visible
  await expect(page.locator('input[name="userName"]')).toBeVisible();
  
  // Check if email input is visible
  await expect(page.locator('input[name="email"]')).toBeVisible();
  
  // Check if password input is visible
  await expect(page.locator('input[name="password"]')).toBeVisible();
  
  // Check if register button exists
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  
  // Check if login link exists
  await expect(page.locator('a[href="/login"]')).toBeVisible();
});

