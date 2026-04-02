import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import Layout from '@/components/shared/Layout'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'

const queryClient = new QueryClient()

function AuthRehydration({ children }: { children: React.ReactNode }) {
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const accessToken = useAuthStore((s) => s.accessToken)
  const setTokens = useAuthStore((s) => s.setTokens)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const needsRehydration = Boolean(refreshToken && !accessToken)
  const [isLoading, setIsLoading] = useState(needsRehydration)

  useEffect(() => {
    if (!needsRehydration) return

    authApi
      .refresh(refreshToken!)
      .then((data) => {
        setTokens(data.accessToken, data.refreshToken, data.user)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthRehydration>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthRehydration>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
