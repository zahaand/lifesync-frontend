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
  await page.getByTestId('identifier-input').fill(user.email)
  await page.getByTestId('password-input').fill(user.password)
  await page.getByTestId('submit-button').click()
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

  await page.getByTestId('new-habit-button').click()
  await page.getByTestId('habit-title-input').fill('E2E Daily Habit')
  await page.getByTestId('habit-submit-button').click()

  await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 10000 })
})

test('complete a habit', async ({ page }) => {
  await login(page)
  await page.goto('/habits')

  await expect(page.getByText('E2E Daily Habit')).toBeVisible({ timeout: 10000 })

  const checkbox = page.locator('[role="checkbox"]').first()
  await checkbox.click()

  await expect(page.getByText('Done today').first()).toBeVisible({ timeout: 5000 })
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
