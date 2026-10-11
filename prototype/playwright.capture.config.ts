import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/capture',
  workers: 1,
  reporter: 'list',
  timeout: 120000,
  use: {
    baseURL: 'http://localhost:5179',
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  },
})
