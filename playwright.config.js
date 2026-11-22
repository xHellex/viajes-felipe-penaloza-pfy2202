import { defineConfig, devices } from '@playwright/test'

// Se prueba el mismo build que se publica: base de GitHub Pages, 404.html y MSW activo.
// 127.0.0.1 y no "localhost": Firefox a veces resolvía localhost a otra dirección (IPv6)
// y fallaba con NS_ERROR_CONNECTION_REFUSED.
const BASE = '/viajes-felipe-penaloza-pfy2202/'
const PUERTO = 4173

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // E2E_URL permite correr las pruebas contra el sitio publicado
    baseURL: process.env.E2E_URL ?? `http://127.0.0.1:${PUERTO}${BASE}`,
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'iphone', use: { ...devices['iPhone 13'] } },
  ],
  webServer: process.env.E2E_URL
    ? undefined
    : {
        command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PUERTO} --strictPort`,
        env: { VITE_BASE_PATH: BASE },
        url: `http://127.0.0.1:${PUERTO}${BASE}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
