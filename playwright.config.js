const dotenv = require('dotenv');
const path = require('path');

// Load the appropriate .env file based on the ENV variable
const envFile = process.env.ENV === "production" ? '.env.production' : '.env.staging';
console.log(`Current ENV: ${process.env.ENV}`);
console.log(`Loading environment file: ${envFile}`);
dotenv.config({ path: path.resolve(__dirname, envFile) });

const { defineConfig } = require('@playwright/test');

//console.log(`Current ENV: ${process.env.ENV}`);

module.exports = defineConfig({
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