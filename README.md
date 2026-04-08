🇷🇺 Описание на русском ниже / 🇬🇧 Russian description below

# LifeSync Frontend v1.2.0

B2C habit and goal tracking web application. Built with React 19 and TypeScript 5.9 using a strict layered architecture with server state isolation.

55 unit tests | 22 E2E tests | 9 sprints | full mobile support | dark mode | bilingual UI (EN/RU)

## Methodology

Built using Spec-Driven Development (SDD) via Spec Kit and Claude Code.

Each feature goes through a structured SDD cycle:

- **Specify** — natural language feature spec with user stories and acceptance criteria
- **Clarify** — structured Q&A to resolve ambiguities before planning
- **Plan** — architecture plan with constitution compliance check
- **Checklist** — pre-implementation quality review
- **Tasks** — dependency-ordered task list with phase grouping
- **Implement** — code generation following the task list
- **Analyze** — post-implementation review against spec and constitution

The project was developed over 9 sprints, each following this full cycle.

## Architecture

The application follows a strict layered architecture with clear separation of concerns:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │  pages  │────▶│  hooks  │────▶│   api   │
  └─────────┘     └─────────┘     └─────────┘
       │
       ▼
  ┌─────────┐
  │ stores  │
  └─────────┘

  components — render only, no business logic
```

**Constitution** — 5 principles enforced across all sprints:

1. **API isolation** — all HTTP calls in `src/api/` via Axios client
2. **Server state** — all remote data via React Query
3. **Component-logic separation** — logic in hooks, components render only
4. **Type safety** — strict TypeScript, no `any` types
5. **Design system fidelity** — shadcn/ui only, no raw HTML elements

## Key Technical Highlights

### Responsive Design (Mobile-First)

Full mobile adaptation across all pages, tested down to 375px. On mobile, the sidebar is replaced with a hamburger menu that opens a Sheet overlay from the left. GoalsPage uses a master-detail toggle — the list fills the screen, tapping a goal replaces it with full-width detail and a back button. HabitCard action buttons collapse into a DropdownMenu on mobile. HabitHistoryDrawer opens as a Sheet from the right. DashboardPage stats switch to a 2-column grid, and card sections stack vertically. The `useIsMobile` hook drives layout decisions via `matchMedia`.

### Optimistic Updates

Habit completion uses React Query optimistic updates — the checkbox toggles immediately and the streak badge updates without waiting for the server. If the request fails, the UI rolls back to the previous state and a toast notification alerts the user.

### Smart Authentication

JWT-based authentication with access and refresh tokens. Access token is stored in Zustand memory state, refresh token in `localStorage` via `zustand/persist`. The Axios response interceptor detects 401 errors and silently refreshes the token using a mutex pattern to prevent concurrent refresh requests. On refresh failure, the user is redirected to the login page.

### Habit History Drawer

Paginated completion log for each habit (TD-002). Uses `useInfiniteQuery` to fetch `GET /habits/{id}/logs` with server-side pagination. Each log entry displays the completion date and time extracted from the `createdAt` timestamp. The drawer includes skeleton loading states, error handling with retry, and a "Load more" button for pagination.

### Dark Mode

Dark mode with system preference detection on first visit and a persistent theme toggle in the user menu. An inline `<head>` script prevents FOCT (Flash of Incorrect Theme) by applying the saved theme class before React renders. The Zustand theme store manages the `'light' | 'dark'` state without persist middleware to avoid race conditions with the inline script. All 24 files with hardcoded colors received `dark:` Tailwind variants using a zinc-based token system.

### Bilingual UI

English and Russian with instant switching, browser language detection, and backend profile sync. Uses react-i18next with 7 translation namespaces (~190 keys per language). Russian pluralization uses `_one/_few/_many` suffixes for streak counts, milestones, and linked habits. Zod validation messages are translated via a global error map. An inline `<head>` script sets `<html lang>` before React renders to prevent flash of incorrect language.

### Smart Greeting

The dashboard greeting uses `displayName` from the user profile when available, falling back to `username`. The time-of-day greeting (Good morning / Good afternoon / Good evening) is determined client-side based on the current hour.

### Testing

Unit and component tests use Vitest with happy-dom, Testing Library for rendering, and MSW 2.x for API mocking. E2E tests use Playwright with Chromium across 5 spec files (auth, habits, goals, profile, mobile) covering 22 test cases. Each spec file registers a fresh user in `beforeAll` and deletes it in `afterAll`. All interactive elements use `data-testid` attributes for selector stability across UI redesigns.

## Features

- **Sprint 1: Authentication** — login, registration, JWT token management, protected routes, silent refresh
- **Sprint 2: Dashboard** — time-of-day greeting, stats row, today's habits widget, active goals widget
- **Sprint 3: Habits** — CRUD, daily/weekly frequency, completion tracking, streaks, archive/restore, filters, search
- **Sprint 4: Goals** — CRUD, milestones, progress tracking, habit linking, master-detail layout, status filters
- **Sprint 5: Profile** — account settings, display name, Telegram linking, stats card, danger zone with account deletion
- **Sprint 6: Mobile adaptation** — responsive layout for all pages, hamburger + Sheet sidebar, Goals master-detail toggle, HabitCard DropdownMenu, habit completion history drawer (TD-002)
- **Sprint 7: Pre-release** — unit tests, E2E tests, data-testid strategy, documentation, build verification
- **Sprint 8: Dark mode** — class-based Tailwind CSS v4 dark theme, FOCT prevention, OS preference detection, user menu update
- **Sprint 9: Internationalization** — react-i18next, EN + RU, ~190 translation keys, Zod validation messages translated, backend locale sync, browser language detection

## Screenshots

| Desktop | Mobile |
|---------|--------|
|         |        |
|         |        |

## Technology Stack

| Concern | Technology |
|---|---|
| Language | TypeScript 5.9 |
| Framework | React 19 |
| Build | Vite 8 |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| HTTP Client | Axios |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Notifications | Sonner |
| Forms | React Hook Form + Zod |
| i18n | react-i18next + i18next |
| Unit Tests | Vitest + Testing Library + MSW 2.x |
| E2E Tests | Playwright (Chromium) |
| Methodology | Spec-Driven Development (SDD) |

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- LifeSync Backend running at `http://localhost:8080`

### Install and Run

```bash
git clone https://github.com/zahaand/lifesync-frontend.git
cd lifesync-frontend
npm install

cp .env.example .env.local
# Edit .env.local if the backend is not at the default address

npm run dev
# Open http://localhost:5173
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

## Running Tests

### Unit and Component Tests

Vitest with happy-dom environment, Testing Library for component rendering, and MSW 2.x for intercepting API calls. 10 test files, 55 test cases.

```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
npm run test:watch      # Run in watch mode
```

### E2E Tests

Playwright with Chromium. Requires the backend to be running at `http://localhost:8080`. 5 spec files, 22 test cases covering authentication, habits, goals, profile, and mobile layouts.

```bash
npx playwright install chromium   # First-time setup
npm run test:e2e                  # Run all E2E tests
npx playwright test --ui          # Run with UI mode for debugging
```

## Project Structure

```
src/
├── api/            # Axios client and endpoint functions (auth, habits, goals, users, habitLogs)
├── components/
│   ├── ui/         # shadcn/ui primitives (Button, Card, Sheet, Dialog, DropdownMenu, etc.)
│   ├── shared/     # Layout, ProtectedRoute, GoalProgress
│   ├── habits/     # HabitCard, HabitFormModal, HabitHistoryDrawer, HabitFilters
│   ├── goals/      # GoalCard, GoalDetail, GoalFormModal, GoalMilestones, GoalLinkedHabits
│   └── profile/    # AccountCard, StatsCard, TelegramCard, DangerZoneCard
├── hooks/          # React Query hooks and utilities (useHabits, useGoals, useAuth, useIsMobile)
├── pages/          # Route pages (LoginPage, DashboardPage, HabitsPage, GoalsPage, ProfilePage)
├── locales/        # Translation JSON files (en/, ru/ — 7 namespaces each)
├── stores/         # Zustand stores (authStore, themeStore, localeStore)
├── test/           # Test setup, MSW handlers, test utilities
├── types/          # TypeScript type definitions (auth, habits, goals, users, habitLogs)
└── lib/            # Utility functions (cn) and i18n config (i18n.ts)
tests/
└── e2e/            # Playwright E2E tests (auth, habits, goals, profile, mobile)
```

## Related

- [LifeSync Backend](https://github.com/zahaand/lifesync-backend) — Java 21, Spring Boot 3.5, PostgreSQL 16, Apache Kafka

---

# LifeSync Frontend v1.2.0

B2C веб-приложение для трекинга привычек и целей. Построено на React 19 и TypeScript 5.9 со строгой слоистой архитектурой и изоляцией серверного состояния.

55 юнит-тестов | 22 E2E-теста | 9 спринтов | полная мобильная поддержка | тёмная тема | двуязычный интерфейс (EN/RU)

## Методология

Разработано с использованием Spec-Driven Development (SDD) через Spec Kit и Claude Code.

Каждая фича проходит структурированный SDD-цикл:

- **Specify** — спецификация фичи на естественном языке с пользовательскими историями и критериями приёмки
- **Clarify** — структурированные вопросы-ответы для устранения неоднозначностей перед планированием
- **Plan** — архитектурный план с проверкой соответствия конституции
- **Checklist** — проверка качества перед реализацией
- **Tasks** — упорядоченный по зависимостям список задач с группировкой по фазам
- **Implement** — генерация кода по списку задач
- **Analyze** — пост-имплементационный обзор против спецификации и конституции

Проект разработан за 9 спринтов, каждый из которых прошёл полный цикл.

## Архитектура

Приложение следует строгой слоистой архитектуре с чётким разделением ответственности:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │  pages  │────▶│  hooks  │────▶│   api   │
  └─────────┘     └─────────┘     └─────────┘
       │
       ▼
  ┌─────────┐
  │ stores  │
  └─────────┘

  components — только рендеринг, без бизнес-логики
```

**Конституция** — 5 принципов, соблюдаемых во всех спринтах:

1. **Изоляция API** — все HTTP-вызовы в `src/api/` через Axios-клиент
2. **Серверное состояние** — все удалённые данные через React Query
3. **Разделение компонентов и логики** — логика в хуках, компоненты только рендерят
4. **Типобезопасность** — строгий TypeScript, никаких `any`
5. **Верность дизайн-системе** — только shadcn/ui, никаких сырых HTML-элементов

## Ключевые технические решения

### Адаптивный дизайн (Mobile-First)

Полная мобильная адаптация всех страниц, протестировано до 375px. На мобильных боковая панель заменяется hamburger-меню, открывающим Sheet-overlay слева. GoalsPage использует переключение master-detail — список занимает весь экран, нажатие на цель заменяет его полноэкранной детальной страницей с кнопкой «Назад». Кнопки действий HabitCard сворачиваются в DropdownMenu на мобильных. HabitHistoryDrawer открывается как Sheet справа. Статистика DashboardPage переключается на 2-колоночную сетку, карточки располагаются вертикально. Хук `useIsMobile` управляет решениями о раскладке через `matchMedia`.

### Оптимистичные обновления

Выполнение привычки использует оптимистичные обновления React Query — чекбокс переключается мгновенно, бейдж серии обновляется без ожидания ответа сервера. При ошибке запроса UI откатывается к предыдущему состоянию, и toast-уведомление оповещает пользователя.

### Умная аутентификация

JWT-аутентификация с access- и refresh-токенами. Access-токен хранится в памяти Zustand, refresh-токен — в `localStorage` через `zustand/persist`. Axios-перехватчик ответов обнаруживает ошибки 401 и бесшумно обновляет токен с использованием мьютекс-паттерна для предотвращения конкурентных запросов на обновление. При неудаче обновления пользователь перенаправляется на страницу входа.

### Drawer истории привычек

Пагинированный лог выполнений для каждой привычки (TD-002). Использует `useInfiniteQuery` для получения `GET /habits/{id}/logs` с серверной пагинацией. Каждая запись лога отображает дату выполнения и время, извлечённое из поля `createdAt`. Drawer включает skeleton-состояния загрузки, обработку ошибок с повторной попыткой и кнопку «Загрузить ещё» для пагинации.

### Тёмная тема

Тёмная тема с определением системных настроек при первом визите и переключателем в меню пользователя. Инлайн-скрипт в `<head>` предотвращает FOCT (Flash of Incorrect Theme), применяя сохранённый класс темы до рендеринга React. Zustand-хранилище управляет состоянием `'light' | 'dark'` без persist middleware во избежание race condition с инлайн-скриптом. Все 24 файла с хардкодными цветами получили `dark:` Tailwind-варианты на основе zinc-токенов.

### Двуязычный интерфейс

Английский и русский с мгновенным переключением, определением языка браузера и синхронизацией с профилем backend. Используется react-i18next с 7 неймспейсами переводов (~190 ключей на язык). Русская плюрализация через суффиксы `_one/_few/_many` для серий, вех и привязанных привычек. Сообщения валидации Zod переведены через глобальный error map. Инлайн-скрипт в `<head>` устанавливает `<html lang>` до рендеринга React для предотвращения мерцания неверного языка.

### Умное приветствие

Приветствие на дашборде использует `displayName` из профиля пользователя, если доступно, с фоллбэком на `username`. Приветствие по времени суток (Доброе утро / Добрый день / Добрый вечер) определяется на клиенте по текущему часу.

### Тестирование

Юнит- и компонентные тесты используют Vitest с happy-dom, Testing Library для рендеринга и MSW 2.x для мокирования API. E2E-тесты используют Playwright с Chromium — 5 файлов спецификаций (auth, habits, goals, profile, mobile), 22 тест-кейса. Каждый файл регистрирует нового пользователя в `beforeAll` и удаляет в `afterAll`. Все интерактивные элементы используют атрибуты `data-testid` для стабильности селекторов при редизайне UI.

## Возможности

- **Спринт 1: Аутентификация** — логин, регистрация, управление JWT-токенами, защищённые маршруты, бесшумное обновление
- **Спринт 2: Dashboard** — приветствие по времени суток, строка статистики, виджет привычек дня, виджет активных целей
- **Спринт 3: Привычки** — CRUD, ежедневная/еженедельная частота, трекинг выполнения, серии, архив/восстановление, фильтры, поиск
- **Спринт 4: Цели** — CRUD, вехи, отслеживание прогресса, привязка привычек, master-detail раскладка, фильтры по статусу
- **Спринт 5: Профиль** — настройки аккаунта, отображаемое имя, привязка Telegram, карточка статистики, danger zone с удалением аккаунта
- **Спринт 6: Мобильная адаптация** — адаптивная раскладка для всех страниц, hamburger + Sheet sidebar, Goals master-detail переключение, HabitCard DropdownMenu, drawer истории выполнений привычек (TD-002)
- **Спринт 7: Предрелиз** — юнит-тесты, E2E-тесты, стратегия data-testid, документация, проверка сборки
- **Спринт 8: Тёмная тема** — class-based Tailwind CSS v4, FOCT prevention, определение OS preference, обновление меню
- **Спринт 9: Интернационализация** — react-i18next, EN + RU, ~190 ключей перевода, перевод Zod валидаций, синхронизация с backend, определение языка браузера

## Скриншоты

| Десктоп | Мобильный |
|---------|-----------|
|         |           |
|         |           |

## Стек технологий

| Область | Технология |
|---|---|
| Язык | TypeScript 5.9 |
| Фреймворк | React 19 |
| Сборка | Vite 8 |
| Маршрутизация | React Router v7 |
| Серверное состояние | TanStack React Query v5 |
| Клиентское состояние | Zustand |
| HTTP-клиент | Axios |
| UI-компоненты | shadcn/ui + Radix UI |
| Стили | Tailwind CSS v4 |
| Иконки | Lucide React |
| Уведомления | Sonner |
| Формы | React Hook Form + Zod |
| i18n | react-i18next + i18next |
| Юнит-тесты | Vitest + Testing Library + MSW 2.x |
| E2E-тесты | Playwright (Chromium) |
| Методология | Spec-Driven Development (SDD) |

## Локальная установка

### Требования

- Node.js 20+
- npm 10+
- LifeSync Backend запущен на `http://localhost:8080`

### Установка и запуск

```bash
git clone https://github.com/zahaand/lifesync-frontend.git
cd lifesync-frontend
npm install

cp .env.example .env.local
# Отредактируйте .env.local, если бэкенд не по адресу по умолчанию

npm run dev
# Откройте http://localhost:5173
```

### Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Базовый URL бэкенд API |

## Запуск тестов

### Юнит- и компонентные тесты

Vitest с окружением happy-dom, Testing Library для рендеринга компонентов, MSW 2.x для перехвата API-вызовов. 10 файлов тестов, 55 тест-кейсов.

```bash
npm test                # Запуск всех тестов
npm run test:coverage   # Запуск с отчётом о покрытии
npm run test:watch      # Запуск в режиме наблюдения
```

### E2E-тесты

Playwright с Chromium. Требуется запущенный бэкенд на `http://localhost:8080`. 5 файлов спецификаций, 22 тест-кейса: аутентификация, привычки, цели, профиль, мобильные раскладки.

```bash
npx playwright install chromium   # Первоначальная установка
npm run test:e2e                  # Запуск всех E2E-тестов
npx playwright test --ui          # Запуск с UI-режимом для отладки
```

## Структура проекта

```
src/
├── api/            # Axios-клиент и функции эндпоинтов (auth, habits, goals, users, habitLogs)
├── components/
│   ├── ui/         # shadcn/ui примитивы (Button, Card, Sheet, Dialog, DropdownMenu и др.)
│   ├── shared/     # Layout, ProtectedRoute, GoalProgress
│   ├── habits/     # HabitCard, HabitFormModal, HabitHistoryDrawer, HabitFilters
│   ├── goals/      # GoalCard, GoalDetail, GoalFormModal, GoalMilestones, GoalLinkedHabits
│   └── profile/    # AccountCard, StatsCard, TelegramCard, DangerZoneCard
├── hooks/          # React Query хуки и утилиты (useHabits, useGoals, useAuth, useIsMobile)
├── pages/          # Страницы маршрутов (LoginPage, DashboardPage, HabitsPage, GoalsPage, ProfilePage)
├── locales/        # JSON-файлы переводов (en/, ru/ — по 7 неймспейсов)
├── stores/         # Zustand-хранилища (authStore, themeStore, localeStore)
├── test/           # Настройка тестов, MSW-обработчики, тестовые у��илиты
├��─ types/          # TypeScript-определения типов (auth, habits, goals, users, habitLogs)
└── lib/            # Утилиты (cn) и конфиг i18n (i18n.ts)
tests/
└── e2e/            # Playwright E2E-тесты (auth, habits, goals, profile, mobile)
```

## Связанные проекты

- [LifeSync Backend](https://github.com/zahaand/lifesync-backend) — Java 21, Spring Boot 3.5, PostgreSQL 16, Apache Kafka
