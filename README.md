# LifeSync Frontend

Habit tracking and goal management application built with React, TypeScript, and Vite.

Приложение для трекинга привычек и управления целями на React, TypeScript и Vite.

## Tech Stack / Стек технологий

- **TypeScript 5.9**, **React 19.2**, **Vite 8**
- **React Router v7** — routing
- **TanStack React Query v5** — server state management
- **Zustand** — client state (auth store)
- **Axios** — HTTP client
- **shadcn/ui + Radix** — UI components (Nova preset)
- **Tailwind CSS v4** — styling
- **Lucide React** — icons
- **Sonner** — toast notifications
- **React Hook Form + Zod** — form handling and validation

## Prerequisites / Требования

- **Node.js** 20+
- **npm** 10+
- Backend running at `http://localhost:8080/api/v1`

## Getting Started / Запуск

```bash
# Clone and install / Клонирование и установка
git clone <repo-url>
cd lifesync-frontend
npm install

# Environment / Переменные окружения
cp .env.example .env.local
# Edit .env.local if needed (default: http://localhost:8080/api/v1)

# Development / Разработка
npm run dev
# Open http://localhost:5173
```

## Scripts / Команды

| Command / Команда | Description / Описание |
|---|---|
| `npm run dev` | Start dev server / Запуск dev-сервера |
| `npm run build` | TypeScript check + production build / Проверка TS + продакшн сборка |
| `npm run preview` | Preview production build / Предпросмотр продакшн сборки |
| `npm run lint` | Run ESLint / Запуск ESLint |
| `npm test` | Run unit tests (Vitest) / Запуск юнит-тестов |
| `npm run test:watch` | Run tests in watch mode / Тесты в режиме наблюдения |
| `npm run test:coverage` | Run tests with coverage / Тесты с покрытием |
| `npm run test:e2e` | Run E2E tests (Playwright) / Запуск E2E-тестов |

## Project Structure / Структура проекта

```
src/
├── api/            # API client and endpoint functions
├── components/
│   ├── ui/         # shadcn/ui components (auto-generated)
│   ├── shared/     # Layout, ProtectedRoute, GoalProgress
│   ├── habits/     # HabitCard, HabitFormModal, HabitHistoryDrawer, etc.
│   ├── goals/      # GoalCard, GoalDetail, GoalFormModal, etc.
│   └── profile/    # AccountCard, StatsCard, TelegramCard, etc.
├── hooks/          # React Query hooks (useHabits, useGoals, useAuth, etc.)
├── pages/          # Route pages (LoginPage, DashboardPage, etc.)
├── stores/         # Zustand stores (authStore)
├── test/           # Test setup, MSW handlers, test utilities
├── types/          # TypeScript type definitions
└── lib/            # Utility functions
tests/
└── e2e/            # Playwright E2E tests
```

## Testing / Тестирование

### Unit Tests / Юнит-тесты

Uses **Vitest** + **Testing Library** + **MSW** for mocking API calls.

Использует **Vitest** + **Testing Library** + **MSW** для мокирования API-вызовов.

```bash
npm test              # Run all unit tests / Запуск всех тестов
npm run test:coverage # Coverage report / Отчёт о покрытии
```

### E2E Tests / E2E-тесты

Uses **Playwright** with Chromium. Requires running backend.

Использует **Playwright** с Chromium. Требует запущенный бэкенд.

```bash
npx playwright install chromium   # First time / Первый запуск
npm run test:e2e                  # Run E2E tests / Запуск E2E-тестов
```

## Environment Variables / Переменные окружения

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |
