import { expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();


class CalendarPage {
  constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: '+ NEW' });
    this.bookingCalendar = page.locator(".scheduler");
    this.salonSearchbox = page.getByRole('textbox', { name: 'Search Salons' })
    this.newDropDownMenu = page.locator("div[data-bem='DropdownFoldout__content']");
    this.salonName = page.locator("div[data-bem='SalonName']");
    this.bookingSidebar = page.locator("#booking-sidebar");
    this.appointmentSelection = page.locator("button[data-tag='SchedulerHeader__item-appointment']");
    this.clientSearchBox = page.locator("input.search-dropdown");
    this.closeSideBarBtn = page.locator(".close-ico");
    this.exitBtn = page.locator('.ServiceSelection_buttonSpace__E7zHf').filter({ hasText: 'EXIT' });
    this.clientList = page.locator(".search-dropdown-results");
    this.serviceCategories = page.locator(".category-name");
    this.serviceCatItem = page.locator("[data-bem='ServiceItem__name']");
    this.serviceList = page.locator("div.service-list");
    this.datePicker = page.locator(".time-btn-container .the-time-shape");
    this.selectStylistBtn = page.getByText("Select Stylist");
    this.selectTimeBtn = page.getByText("Select Time");
    this.sideBar = page.locator(".BookingWindow");
    this.manageAptButton = page.locator("[data-bem='ManageAppointmentButton__manage']");
    this.deleteAptButton = page.locator("[data-tag='ManageAppointmentButton__item-delete']");
    this.resheduleAptButton = page.locator("[data-tag='ManageAppointmentButton__item-reschedule']");
    this.appointmentSidebar = page.locator("[data-bem ='Sidebar__toolbar']");
    this.selectedCalendarDate = page.locator(".selected-date");
  }
    async navigateToCalendarPage(calendarURL) {
    calendarURL = process.env.Calendar_URL;
    await this.page.goto(calendarURL) ;
    }

    async searchYourSalon(salonName) {
    await this.salonSearchbox.fill(salonName);
    await this.page.getByRole('button', { name: salonName }).first().click();
    await expect(this.bookingCalendar).toBeVisible();
    expect(await this.salonName).toContainText(salonName);
  }

    async addNewClient(clientName) {
      this.clientNameBox = this.page.getByRole('textbox', { name: 'Client Name' });
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.page.getByRole('button', { name: '+ Add new client' }).click();
      await this.clientNameBox.fill(clientName);
      await this.page.getByRole('button', { name: 'SAVE NEW CLIENT' }).click();
      await this.closeSideBarBtn.click();
      await this.exitBtn.click();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);
      await expect(this.clientList).toContainText(clientName);
      await this.closeSideBarBtn.click();
    }

    async bookAndDelAnAppointment(clientName, serviceCategory, serviceName, stylistName) {
      var appointmentDetails = this.page.locator(".cal-client").filter({ HasText: clientName}).first();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);
      await expect(this.clientList).toContainText(clientName);
      await this.page.getByRole('button', { name: clientName }).first().click();
      await expect(this.serviceList).toBeVisible();
      await this.serviceCategories.filter({ hasText: serviceCategory}).click();
      await this.serviceCatItem.filter({ hasText: serviceName}).first().click();
      await this.selectStylistBtn.click();
      await this.page.getByRole('button', { name: stylistName }).nth(2).click();
      await this.selectTimeBtn.click();
      await this.datePicker.last().click();
      await this.page.getByRole('button', { name: 'Save booking' }).click();
      await expect(this.sideBar).not.toBeVisible();
      await expect(appointmentDetails).toBeVisible();
      await this.deleteAppointment(clientName);
      
    }

    async bookAnAppointment (clientName, serviceCategory, serviceName, stylistName) {
      var appointmentDetails = this.page.locator(".cal-client").filter({ HasText: clientName}).first();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);
      await expect(this.clientList).toContainText(clientName);
      await this.page.getByRole('button', { name: clientName }).first().click();
      await expect(this.serviceList).toBeVisible();
      await this.serviceCategories.filter({ hasText: serviceCategory}).click();
      await this.serviceCatItem.filter({ hasText: serviceName}).first().click();
      await this.selectStylistBtn.click();
      await this.page.getByRole('button', { name: stylistName }).nth(2).click();
      await this.selectTimeBtn.click();
      await this.datePicker.last().click();
      await this.page.getByRole('button', { name: 'Save booking' }).click();
      await expect(this.sideBar).not.toBeVisible();
      await expect(appointmentDetails).toBeVisible();
    }

    async deleteAppointment(clientName) {
      
      var appointmentDetails = this.page.locator(".cal-client").filter({ HasText: clientName}).first();
      if (!await appointmentDetails.isVisible()) {
        this.bookAnAppointment(clientName, 'Colouring', 'Full Head Highlights', 'John Doe');
      }
      else{
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await this.manageAptButton.click();
      await this.deleteAptButton.click();
      await this.page.getByText('DELETE BOOKING').click();
      await expect(appointmentDetails).not.toBeVisible();
    }}

    async rescheduleAppointment(clientName, date) {
      var appointmentDetails = this.page.locator(".cal-client").filter({ HasText: clientName}).first();
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await this.manageAptButton.click();
      await this.page.getByRole('button', { name: 'Reschedule', exact: true }).click();
      await this.page.getByRole('option', { name: date}).click();
      await this.page.getByRole('button', { name: 'Save booking' }).click();
      await expect(this.sideBar).not.toBeVisible();
      await expect(this.selectedCalendarDate).toContainText(date.replace('day-', ''));
      await expect(appointmentDetails).toBeVisible();
    }
  }

module.exports = CalendarPage;