const { chromium, firefox, webkit } = require('playwright');

let browser = null;
let context = null;
let page = null;

const DEFAULTS = {
  browser: process.env.BROWSER, // chromium | firefox | webkit
  headless: process.env.HEADLESS,
  baseURL: process.env.BASE_URL,
};

async function setup() {
  const env = process.env.ENV;
  console.log(`Setting up tests for environment: ${env}`);
  const browserType = { chromium, firefox, webkit }[DEFAULTS.browser];
  browser = await browserType.launch({ headless: DEFAULTS.headless === 'true' });
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(DEFAULTS.baseURL);
  return { browser, context, page };
}

async function teardown() {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
}

module.exports = {
  setup,
  teardown,
};