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
    this.serviceCategories = page.locator("div[data-tag='ServiceSelection__service-selection-content']").first();
    this.serviceList = page.locator("div.service-list");
    this.datePicker = page.locator("#bookingDayPicker");
    this.selectStylistBtn = page.getByText("Select Stylist");
    this.selectTimeBtn = page.getByText("Select Time");
    this.sideBar = page.locator(".BookingWindow");
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

    async bookAnAppointment(clientName, serviceName, stylistName, date, time) {
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);
      await expect(this.clientList).toContainText(clientName);
      await this.page.getByRole('button', { name: clientName }).first().click();
      await this.serviceCategories.click();
      await this.serviceList.filter({ hasText: serviceName }).click();
      await this.selectStylistBtn.click();
      await this.page.getByRole('button', { name: stylistName }).click();
      await this.datePicker.fill(date);
      await this.selectTimeBtn.click();
      await this.page.getByRole('button', { name: time }).click();
      await this.page.getByRole('button', { name: 'BOOK APPOINTMENT' }).click();
      await expect(this.sideBar).toContainText('Appointment booked successfully');
    }
  }

module.exports = CalendarPage;