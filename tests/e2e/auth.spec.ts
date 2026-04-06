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

  await page.getByRole('button', { name: /sign up/i }).click()
  await page.getByLabel(/^email$/i).fill(user.email)
  await page.getByLabel(/username/i).fill(user.username)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /create account/i }).click()

  await expect(page.getByText(/account created/i)).toBeVisible({ timeout: 10000 })
})

test('login with email', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel(/email or username/i).fill(user.email)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /sign in/i }).filter({ has: page.locator('[type="submit"]') }).click()

  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

  // Store token for cleanup
  const tokens = await loginUser({ email: user.email, password: user.password })
  accessToken = tokens.accessToken
})

test('login with username', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel(/email or username/i).fill(user.username)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /sign in/i }).filter({ has: page.locator('[type="submit"]') }).click()

  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
})

test('login with wrong password shows error', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel(/email or username/i).fill(user.email)
  await page.getByLabel(/password/i).fill('WrongPassword123!')
  await page.getByRole('button', { name: /sign in/i }).filter({ has: page.locator('[type="submit"]') }).click()

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
  await page.getByLabel(/email or username/i).fill(user.email)
  await page.getByLabel(/password/i).fill(user.password)
  await page.getByRole('button', { name: /sign in/i }).filter({ has: page.locator('[type="submit"]') }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

  // Logout
  await page.getByRole('button', { name: /log out/i }).click()

  await expect(page).toHaveURL(/login/, { timeout: 10000 })
})
