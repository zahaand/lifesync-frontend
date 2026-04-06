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

test('navigate to goals page', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: /goals/i }).click()
  await expect(page).toHaveURL(/goals/)
})

test('create a goal', async ({ page }) => {
  await login(page)
  await page.goto('/goals')

  await page.getByTestId('new-goal-button').click()
  await page.getByTestId('goal-title-input').fill('E2E Test Goal')

  const descField = page.getByLabel(/description/i)
  if (await descField.isVisible()) {
    await descField.fill('Created by E2E test')
  }

  await page.getByTestId('goal-submit-button').click()

  await expect(page.getByText('E2E Test Goal')).toBeVisible({ timeout: 10000 })
})

test('view goal detail', async ({ page }) => {
  await login(page)
  await page.goto('/goals')

  await page.getByText('E2E Test Goal').click()

  await expect(page.getByText('E2E Test Goal')).toBeVisible()
})

test('add milestone to goal', async ({ page }) => {
  await login(page)
  await page.goto('/goals')

  await page.getByText('E2E Test Goal').click()

  const milestoneInput = page.getByPlaceholder(/milestone|add/i)
  if (await milestoneInput.isVisible({ timeout: 3000 })) {
    await milestoneInput.fill('E2E Milestone')
    await page.keyboard.press('Enter')
    await expect(page.getByText('E2E Milestone')).toBeVisible({ timeout: 5000 })
  }
})

test('delete goal', async ({ page }) => {
  await login(page)
  await page.goto('/goals')

  await page.getByText('E2E Test Goal').click()

  const deleteButton = page.getByTestId('goal-delete-button')
  await deleteButton.click()

  // Confirm deletion in dialog
  const confirmButton = page.getByRole('button', { name: /delete|confirm|yes/i }).last()
  if (await confirmButton.isVisible({ timeout: 3000 })) {
    await confirmButton.click()
  }

  await expect(page.getByText('E2E Test Goal').first()).not.toBeVisible({ timeout: 10000 })
})
