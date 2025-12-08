import { config } from 'dotenv';
import { resolve } from 'path';

// Load the appropriate .env file based on the ENV variable
const envFile = process.env.ENV === '.env.test' ? '.env.production' : '.env.staging';
console.log(`Current ENV: ${process.env.ENV}`);
console.log(`Loading environment file: ${envFile}`);
config({ path: resolve(__dirname, envFile) });

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'Tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  use: {
    headless: process.env.HEADLESS==='true',
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
});