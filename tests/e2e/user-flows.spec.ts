import { test, expect, Locator } from '@playwright/test'

async function findLoadMore(scope: Locator): Promise<Locator | null> {
  const candidates: Locator[] = [
    scope.getByRole('button', { name: /load more news/i }),
    scope.getByRole('button', { name: /load more/i }),
    scope.getByRole('link', { name: /load more news/i }),
    scope.getByRole('link', { name: /load more/i }),
    scope.getByText(/^load more news$/i),
    scope.getByText(/^load more$/i),
  ]
  for (const c of candidates) {
    if (await c.count()) {
      const first = c.first()
      if (await first.isVisible()) return first
    }
  }
  return null
}

test('complete user journey - top to news with load more', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Hacker News')).toBeVisible()

  const topArticles = page.locator('article')
  await expect(topArticles.first()).toBeVisible({ timeout: 10000 })
  const initialTopCount = await topArticles.count()
  expect(initialTopCount).toBeGreaterThan(0)

  const mainNav = page.getByLabel('Main navigation')
  await mainNav.getByRole('link', { name: 'News' }).click()
  await expect(page).toHaveURL(/\/news$/)

  const main = page.getByRole('main')
  const newsArticles = main.locator('article')
  await expect(newsArticles.first()).toBeVisible({ timeout: 10000 })
  const before = await newsArticles.count()

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  const loadMore = await findLoadMore(main)
  if (loadMore && (await loadMore.isVisible())) {
    await loadMore.scrollIntoViewIfNeeded()
    await loadMore.click()
    await expect(newsArticles.nth(before)).toBeVisible({ timeout: 10000 })
  }
})
