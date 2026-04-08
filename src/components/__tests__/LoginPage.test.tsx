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
  return screen.getAllByRole('button', { name: /login\.submit/i }).find(
    (btn) => btn.getAttribute('type') === 'submit',
  )!
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('LoginPage', () => {
  it('renders sign-in form with identifier and password fields', () => {
    render(<LoginPage />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/login\.emailOrUsername/)).toBeInTheDocument()
    expect(screen.getByLabelText(/login\.password/)).toBeInTheDocument()
    expect(getSubmitButton()).toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.click(getSubmitButton())

    const errors = await screen.findAllByText(/too small/i)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('calls login on valid submit', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText(/login\.emailOrUsername/), 'testuser')
    await user.type(screen.getByLabelText(/login\.password/), 'password123')
    await user.click(getSubmitButton())

    await vi.waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-access-token')
    })
  })

  it('switches to sign-up tab and shows register form', async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: /register\.submit/ }))

    expect(screen.getByLabelText(/register\.email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/register\.username/)).toBeInTheDocument()
  })
})
