import { test, expect } from '@playwright/test'
import { generateUser, registerUser, loginUser, deleteUser } from './helpers'

const user = generateUser()
let accessToken = ''

test.describe.configure({ mode: 'serial' })
test.use({ viewport: { width: 375, height: 812 } })

test.beforeAll(async () => {
  await registerUser(user)
  const tokens = await loginUser({ email: user.email, password: user.password })
  accessToken = tokens.accessToken
})

test.afterAll(async () => {
  if (accessToken) {
    await deleteUser(accessToken)
  }
})

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByTestId('identifier-input').fill(user.email)
  await page.getByTestId('password-input').fill(user.password)
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
}

test('hamburger button visible on mobile', async ({ page }) => {
  await login(page)

  // Sidebar should be hidden; hamburger should be visible
  const hamburger = page.locator('button').filter({ has: page.locator('svg.lucide-menu') })
  await expect(hamburger).toBeVisible({ timeout: 5000 })
})

test('open sidebar overlay via hamburger', async ({ page }) => {
  await login(page)

  const hamburger = page.locator('button').filter({ has: page.locator('svg.lucide-menu') })
  await hamburger.click()

  // Sidebar overlay should be visible with nav items
  await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible({ timeout: 5000 })
  await expect(page.getByRole('link', { name: /habits/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /goals/i })).toBeVisible()
})

test('navigate via sidebar overlay', async ({ page }) => {
  await login(page)

  const hamburger = page.locator('button').filter({ has: page.locator('svg.lucide-menu') })
  await hamburger.click()

  await page.getByRole('link', { name: /habits/i }).click()

  await expect(page).toHaveURL(/habits/, { timeout: 10000 })
})

test('goals: tap goal shows detail, back returns to list', async ({ page }) => {
  await login(page)

  // First create a goal
  await page.goto('/goals')
  await page.getByTestId('new-goal-button').click()
  await page.getByTestId('goal-title-input').fill('Mobile Goal Test')
  await page.getByTestId('goal-submit-button').click()
  await expect(page.getByText('Mobile Goal Test')).toBeVisible({ timeout: 10000 })

  // Tap goal card to see detail
  await page.getByText('Mobile Goal Test').click()

  // Back button should be visible on mobile
  const backButton = page.getByTestId('goals-back-button')
  await expect(backButton).toBeVisible({ timeout: 5000 })

  // Click back to return to list
  await backButton.click()

  // Should see the list again
  await expect(page.getByText('Mobile Goal Test')).toBeVisible({ timeout: 5000 })
})
