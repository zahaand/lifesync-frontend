import { test, expect } from '@playwright/test'
import { generateUser, deleteUser, loginUser } from './helpers'

const user = generateUser()
let accessToken = ''

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
  // Register user via API for login tests
})

test.afterAll(async () => {
  if (accessToken) {
    await deleteUser(accessToken)
  }
})

test('register new user', async ({ page }) => {
  await page.goto('/login')

  await page.getByTestId('sign-up-tab').click()
  await page.getByTestId('email-input').fill(user.email)
  await page.getByTestId('username-input').fill(user.username)
  await page.getByTestId('register-password-input').fill(user.password)
  await page.getByTestId('submit-button').click()

  await expect(page.getByText(/account created/i)).toBeVisible({ timeout: 10000 })
})

test('login with email', async ({ page }) => {
  await page.goto('/login')

  await page.getByTestId('identifier-input').fill(user.email)
  await page.getByTestId('password-input').fill(user.password)
  await page.getByTestId('submit-button').click()

  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

  // Store token for cleanup (best-effort — test passes regardless)
  try {
    const tokens = await loginUser({ email: user.email, password: user.password })
    accessToken = tokens.accessToken
  } catch {
    // Token acquisition may fail transiently; cleanup will be skipped
  }
})

test('login with username', async ({ page }) => {
  await page.goto('/login')

  await page.getByTestId('identifier-input').fill(user.username)
  await page.getByTestId('password-input').fill(user.password)
  await page.getByTestId('submit-button').click()

  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
})

test('login with wrong password shows error', async ({ page }) => {
  await page.goto('/login')

  await page.getByTestId('identifier-input').fill(user.email)
  await page.getByTestId('password-input').fill('WrongPassword123!')
  await page.getByTestId('submit-button').click()

  await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 10000 })
})

test('protected route redirects to login', async ({ page }) => {
  // Clear any auth state
  await page.goto('/login')
  await page.evaluate(() => localStorage.clear())

  await page.goto('/dashboard')

  await expect(page).toHaveURL(/login/, { timeout: 10000 })
})

test('logout redirects to login', async ({ page }) => {
  // Login first
  await page.goto('/login')
  await page.getByTestId('identifier-input').fill(user.email)
  await page.getByTestId('password-input').fill(user.password)
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

  // Logout via user chip dropdown
  await page.getByTestId('user-chip').click()
  await page.getByRole('menuitem', { name: /log out/i }).click()

  await expect(page).toHaveURL(/login/, { timeout: 10000 })
})
