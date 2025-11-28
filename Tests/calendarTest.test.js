const { test, expect } = require('@playwright/test');
const CalendarPage = require('../Pages/CalendarPage');
const LoginPage = require('../Pages/LoginPage');
const hooks = require('../Support/hooks');
require('dotenv').config();

let page;
let loginPage;

test.beforeAll(async () => {
  const setup = await hooks.setup();
  page = setup.page;
  loginPage = new LoginPage(page);
});

test.beforeEach(async () => {
  // Log in before each test
  await loginPage.navigateToLoginPage(process.env.BASE_URL);
  await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
});

test.afterAll(async () => {
  await hooks.teardown();
});

test('Validate Calendar Page visibility', async () => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.navigateToCalendarPage(process.env.Calendar_URL);
  const title = await page.title();
  expect(title).toContain('SLICK (#/) (DEVELOPMENT)');
});

test('Validate correct salon is visible', async () => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
});

test('Add new client from Calendar Page', async () => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.addNewClient('Auto Test Client');
});

