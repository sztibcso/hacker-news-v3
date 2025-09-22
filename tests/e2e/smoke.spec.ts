import { test, expect } from '@playwright/test'

test('application loads and displays stories', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Hacker News/i)
  await expect(page.getByText('Hacker News')).toBeVisible()
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
})

test('can navigate to News and see stories', async ({ page }) => {
  await page.goto('/')
  const mainNav = page.getByLabel('Main navigation')
  await mainNav.getByRole('link', { name: 'News' }).click()
  await expect(page).toHaveURL(/\/news$/)
  const articles = page.locator('article')
  await expect(articles.first()).toBeVisible({ timeout: 10000 })
  const count = await articles.count()
  expect(count).toBeGreaterThan(0)
})
