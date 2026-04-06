import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import { useAuthStore } from '@/stores/authStore'
import type { ReactNode } from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

function getSubmitButton() {
  return screen.getAllByRole('button', { name: /sign in/i }).find(
    (btn) => btn.getAttribute('type') === 'submit',
  )!
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('LoginPage', () => {
  it('renders sign-in form with identifier and password fields', () => {
    render(<LoginPage />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(getSubmitButton()).toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.click(getSubmitButton())

    expect(await screen.findByText(/email or username is required/i)).toBeInTheDocument()
  })

  it('calls login on valid submit', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText(/email or username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(getSubmitButton())

    await vi.waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-access-token')
    })
  })

  it('switches to sign-up tab and shows register form', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
  })
})
