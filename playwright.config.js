import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'file://' + path.resolve(__dirname).replace(/\\/g, '/') + '/src/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
  ],
});
