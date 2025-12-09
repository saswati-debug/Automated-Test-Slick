const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const hooks = require('../Support/hooks');
require('dotenv').config();

let page;

test.beforeEach(async () => {
  const setup = await hooks.setup();
  page = setup.page;
});

test.afterEach(async () => {
  await hooks.teardown();
});

test('Validate Slick Webpage visibility', async () => {
    await page.goto(process.env.BASE_URL);
    const title = await page.title();
    expect(title).toBe('SLICK (#/) (DEVELOPMENT)');
});

test('Successful login with valid credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
    await expect(page).toHaveURL(`${process.env.BASE_URL}salon/#/salon`);
});

test('Unsuccessful login with invalid credentials', async () => {
    test.setTimeout = 30000;
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login('invalidUser', 'invalidPass');
});

test('Unsuccessful login with empty credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.blankLoginAttempt('', '');
}); 