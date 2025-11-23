const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/loginPage');
require('dotenv').config();


test('Validate Slick Webpage visibility', async ({ page }) => {
    await page.goto(process.env.BASE_URL);
    const title = await page.title();
    expect(title).toBe('SLICK (#/) (DEVELOPMENT)');
});

test('Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
    await expect(page).toHaveURL(`${process.env.BASE_URL}salon/#/salon`);
});

test.skip('Unsuccessful login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login('invalidUser', 'invalidPass');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid username or password.');
});

test.skip('Unsuccessful login with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(process.env.BASE_URL);
    await loginPage.login('', '');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Username and password are required.');
}); 