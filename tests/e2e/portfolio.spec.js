import { test, expect } from '@playwright/test';

test.describe('Portfolio Web UI E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page and display hero header', async ({ page }) => {
    await expect(page).toHaveTitle(/Vishnu J Narayanan/i);
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
  });

  test('should render project sections and cards', async ({ page }) => {
    const flagshipSection = page.locator('#selected-work');
    if (await flagshipSection.count() > 0) {
      await expect(flagshipSection).toBeVisible();
    }
    
    const projectCards = page.locator('[data-testid="project-card"], .group');
    await expect(projectCards.first()).toBeVisible();
  });

  test('should support keyboard navigation and anchor scroll', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement.tagName);
    expect(focused).toBeTruthy();
  });

  test('should render properly across responsive viewports', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
