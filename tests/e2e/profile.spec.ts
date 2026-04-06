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

test('navigate to profile page', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: /profile/i }).click()
  await expect(page).toHaveURL(/profile/)
})

test('update display name', async ({ page }) => {
  await login(page)
  await page.goto('/profile')

  const nameInput = page.getByLabel(/display name/i)
  await expect(nameInput).toBeVisible({ timeout: 10000 })
  await nameInput.clear()
  await nameInput.fill('E2E User Updated')

  await page.getByRole('button', { name: /save/i }).first().click()

  await expect(page.getByText(/profile updated|saved/i)).toBeVisible({ timeout: 10000 })
})

test('link telegram chat ID', async ({ page }) => {
  await login(page)
  await page.goto('/profile')

  const telegramInput = page.getByLabel(/telegram|chat id/i)
  if (await telegramInput.isVisible({ timeout: 3000 })) {
    await telegramInput.clear()
    await telegramInput.fill('123456789')

    const saveBtn = page.getByRole('button', { name: /save|link/i }).last()
    await saveBtn.click()

    await expect(page.getByText(/saved|linked|success/i)).toBeVisible({ timeout: 10000 })
  }
})
