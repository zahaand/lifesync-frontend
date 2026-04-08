import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

vi.mock('i18next', () => ({
  default: {
    t: (key: string) => key,
    language: 'en',
    changeLanguage: vi.fn(),
    use: vi.fn().mockReturnThis(),
    init: vi.fn(),
  },
  __esModule: true,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: () => {} },
}))

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
