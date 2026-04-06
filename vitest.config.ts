import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/hooks/**', 'src/components/**'],
      exclude: ['src/components/ui/**'],
    },
    exclude: ['node_modules', 'specs', 'tests/e2e'],
    env: {
      VITE_API_BASE_URL: 'http://localhost:8080/api/v1',
    },
  },
})
