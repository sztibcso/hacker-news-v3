import { test, expect } from '@playwright/test'

test('application loads and displays stories', async ({ page }) => {
  await page.goto('/')
  
  await expect(page).toHaveTitle(/Vite/)
  await expect(page.getByText('Hacker News')).toBeVisible()
  await expect(page.getByText('Top Stories')).toBeVisible()
  
  // Várjuk meg hogy betöltődjenek a story-k
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
})

test('can switch between top and new stories', async ({ page }) => {
  await page.goto('/')
  
  // Várjuk meg az első story-kat
  await expect(page.locator('article').first()).toBeVisible()
  
  // Váltás new story-kra
  await page.click('text=New Stories')
  
  // Ellenőrizzük hogy a tab aktív
  await expect(page.locator('[aria-selected="true"]', { hasText: 'New Stories' })).toBeVisible()
})