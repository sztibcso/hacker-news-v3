import { test, expect } from '@playwright/test'

test('complete user journey - top to new stories with load more', async ({ page }) => {
  await page.goto('/')
  
  // Initial load
  await expect(page.getByText('Hacker News')).toBeVisible()
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
  
  // Count initial stories
  const initialStories = await page.locator('article').count()
  expect(initialStories).toBeGreaterThan(0)
  
  // Switch to new stories
  await page.click('text=New Stories')
  await expect(page.locator('[aria-selected="true"]', { hasText: 'New Stories' })).toBeVisible()
  
  // Load more if available
  const loadMoreButton = page.locator('text=Load More Stories')
  if (await loadMoreButton.isVisible()) {
    const storiesBeforeLoadMore = await page.locator('article').count()
    await loadMoreButton.click()
    
    await expect(page.locator('article').nth(storiesBeforeLoadMore)).toBeVisible({ timeout: 10000 })
  }
})