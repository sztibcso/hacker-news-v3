import { test, expect } from '@playwright/test'

test('complete user journey - top to news with load more', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Hacker News')).toBeVisible()
  
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
  const initialTopCount = await page.locator('article').count()
  expect(initialTopCount).toBeGreaterThan(0)

  const mainNav = page.getByLabel('Main navigation')
  const newsLink = mainNav.getByRole('link', { name: 'News' })
  await newsLink.click()
  await expect(page).toHaveURL(/\/news$/)

  const newsArticles = page.locator('article')
  await expect(newsArticles.first()).toBeVisible({ timeout: 10000 })
  const before = await newsArticles.count()

  const loadMoreBtn = page.getByRole('button', { name: /load more/i })
  if (await loadMoreBtn.count()) {
    await loadMoreBtn.click()
    await expect(newsArticles.nth(before)).toBeVisible({ timeout: 10000 })
  } else {
    const loadMoreLink = page.locator('a', { hasText: /load more/i })
    if (await loadMoreLink.count()) {
      await loadMoreLink.click()
      await expect(newsArticles.nth(before)).toBeVisible({ timeout: 10000 })
    }
  }
})