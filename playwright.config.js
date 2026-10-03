import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './packages/julia-runtime/test/browser',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5177',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader'],
    },
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-iphone15', use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5177',
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NODE_ENV: 'development',
      JULIA_WINDOW_ALLOW_TEST_TTL: 'true',
      JULIA_WINDOW_TTL_SECONDS: '3',
      VITE_PORT: '5177',
    },
  },
});
