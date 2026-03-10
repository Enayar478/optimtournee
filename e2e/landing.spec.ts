import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('hero section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('CTA button is clickable', async ({ page }) => {
    await page.goto('/')
    const ctaButton = page.getByRole('link', { name: /commencer|démarrer|essai|gratuit/i }).first()
    await expect(ctaButton).toBeVisible()
  })

  test('/demo is accessible without auth', async ({ page }) => {
    const response = await page.goto('/demo')
    expect(response?.status()).not.toBe(401)
    expect(response?.status()).not.toBe(403)
  })

  test('/dashboard redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/sign-in|login/, { timeout: 10000 })
  })
})
