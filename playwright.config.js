import { config } from 'dotenv';
import { resolve } from 'path';

// Load the appropriate .env file based on the ENV variable
const envFile = process.env.ENV === 'production'
  ? '.env.production'
  : process.env.ENV === 'staging'
  ? '.env.staging'
  : '.env.staging'; // Default to .env.test if ENV is not set
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