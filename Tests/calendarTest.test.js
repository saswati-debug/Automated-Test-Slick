const { test, expect } = require('@playwright/test');
const CalendarPage = require('../Pages/calendarPage');
const LoginPage = require('../Pages/LoginPage');
require('dotenv').config();

let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage(process.env.BASE_URL);
  await loginPage.login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD);
});

test('Validate Calendar Page visibility', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.navigateToCalendarPage(process.env.Calendar_URL);
  const title = await page.title();
  expect(title).toContain('SLICK (#/) (DEVELOPMENT)');
});

test('Add new client from Calendar Page', async ({ page }) => {
  test.setTimeout(30000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.addNewClient('Auto Test Client');
});

test('Validate correct salon is visible', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
});

test.skip('Book an appointment with a new client', async ({ page }) => {
  test.setTimeout(30000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.addNewClient('Auto Test Client');
  await calendarPage.bookAnAppointment('Auto Test Client', 'Coulouring', 'John Doe', '2026-01-01', '10:00 AM');
});



