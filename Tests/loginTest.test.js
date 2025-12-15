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

test('@smoke @regression Validate Slick Webpage visibility', async () => {
    await page.goto(process.env.BASE_URL);
    const title = await page.title();
    expect(title).toBe('SLICK (#/) (DEVELOPMENT)');
});

test('@smoke @regression Successful login with valid credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
    await expect(page).toHaveURL(`${process.env.BASE_URL}salon/#/salon`);
});

test('@smoke @regression Unsuccessful login with invalid credentials', async () => {
    test.setTimeout = 30000;
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login('invalidUser', 'invalidPass');
});

test('@regression Unsuccessful login with empty credentials', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.blankLoginAttempt('', '');
}); 

test('@smoke @regression Login for user with single salon access', async() => {
    const salonList = page.locator("div.salon-list");
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.SINGLE_SALON_USER, process.env.SINGLE_SALON_PASSWORD);
    await expect(salonList).not.toBeVisible();
    await loginPage.singleSalonLoginValidation("OneSalonAccess");
});

test