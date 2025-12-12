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
  await calendarPage.addNewClient('Appointmenttoreschedule');
});

test('Validate correct salon is visible', async ({ page }) => {
  test.setTimeout(20000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
});


test('Book an appointment with a new client and delete appointment', async ({ page }) => {
  test.setTimeout(60000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.addNewClient('Auto Test Client');
  await calendarPage.bookAndDelAnAppointment('Auto Test Client', 'Colouring', 'Full Head Highlights', 'John Doe');
});

test('Book an appointment with existing client and delete appointment', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.bookAndDelAnAppointment('Auto Test Client', 'Ladies Cutting', 'Ladies Cut & Blow Dry','Sas');
});

test('Reschedule an existing appointment', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.bookAnAppointment('Appointmenttoreschedule', 'Colouring', 'Full Head Highlights', 'John Doe');
  await calendarPage.rescheduleAppointment('AppointmentToReschedule', 'day-30');
  
});

test('Delete an existing appointment', async ({ page }) => {
  test.setTimeout(60000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.deleteAppointment('Appointmenttoreschedule');
});

test('Book an appointment and checkout successfully', async ({ page }) => {
  test.setTimeout(60000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.bookAnAppointment('Checkoutclient', 'Colouring', 'Full Head Highlights', 'John Doe');
  await calendarPage.checkoutAppointment('Checkoutclient');
  await calendarPage.deleteCheckedOutAppointment('Checkoutclient');
  });

test('Confirm a booked appointment', async ({ page }) => {

  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.bookAnAppointment('Confirmclient', 'Colouring', 'Full Head Highlights', 'John Doe');
  await calendarPage.confirmAppointment('Confirmclient');
});

test('Cancel a booked appointment', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.bookAnAppointment('Cancelclient', 'Colouring', 'Full Head Highlights', 'John Doe');
  await calendarPage.cancelAppointment('Cancelclient');
  await calendarPage.deleteCheckedOutAppointment('Cancelclient');
});

test('Create multiple appointments for a client', async ({ page }) => {
  test.setTimeout(120000);
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.createMultipleAppointments('Multiappclient', 3);
});

test('Delete all test appointments after tests', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  await calendarPage.searchYourSalon('Sas\'s Salon');
  await calendarPage.deleteAllTestAppointments();
});