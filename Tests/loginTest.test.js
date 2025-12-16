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
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.SINGLE_SALON_USER, process.env.SINGLE_SALON_PASSWORD);
    await loginPage.singleSalonLoginValidation("OneSalonAccess");
});

test('@smoke @regression Login for user with multiple salon access', async() => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
    await loginPage.multiSalonLoginValidation("Sas Testing Email");
});

test('@smoke @regression Login for salon with PIN access enabled', async() => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.PIN_ENABLED_SALON_USERNAME, process.env.PIN_ENABLED_SALON_PASSWORD)
    await loginPage.loginWithAccuratePin("QA_Pin_TestSalon-DoNotUse",process.env.PIN);
});

test('@smoke @regression Login failure for salon with PIN access enabled with wrong pin', async() => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.PIN_ENABLED_SALON_USERNAME, process.env.PIN_ENABLED_SALON_PASSWORD)
    await loginPage.loginWithInaccuratePin("QA_Pin_TestSalon-DoNotUse","1234");
});