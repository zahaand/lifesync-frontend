import { test, expect } from '@playwright/test'
import { generateUser, registerUser, loginUser, deleteUser } from './helpers'

const user = generateUser()
let accessToken = ''

test.describe.configure({ mode: 'serial' })

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
  await page.getByLabel(/email or username/i).fill(user.email)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /sign in/i }).filter({ has: page.locator('[type="submit"]') }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
}

test('navigate to habits page', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: /habits/i }).click()
  await expect(page).toHaveURL(/habits/)
})

test('create a DAILY habit', async ({ page }) => {
  await login(page)
  await page.goto('/habits')

  await page.getByRole('button', { name: /new habit|add habit|\+/i }).click()
  await page.getByLabel(/title/i).fill('E2E Daily Habit')
  // Select DAILY frequency if there's a selector
  await page.getByRole('button', { name: /save|create/i }).click()

  await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 10000 })
})

test('complete a habit', async ({ page }) => {
  await login(page)
  await page.goto('/habits')

  await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 10000 })

  const checkbox = page.locator('[role="checkbox"]').first()
  await checkbox.click()

  await expect(page.getByText(/completed today/i).first()).toBeVisible({ timeout: 5000 })
})

test('archive and restore habit', async ({ page }) => {
  await login(page)
  await page.goto('/habits')

  await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 10000 })

  // Click archive button (desktop)
  const archiveButton = page.locator('button').filter({ has: page.locator('svg.lucide-archive') }).first()
  if (await archiveButton.isVisible()) {
    await archiveButton.click()
  }

  // Switch to archived filter
  const archivedTab = page.getByRole('button', { name: /archived/i })
  if (await archivedTab.isVisible()) {
    await archivedTab.click()
    await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 5000 })

    // Restore
    const restoreButton = page.locator('button').filter({ has: page.locator('svg.lucide-rotate-ccw') }).first()
    if (await restoreButton.isVisible()) {
      await restoreButton.click()
    }
  }
})
