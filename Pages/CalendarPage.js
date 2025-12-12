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
    this.selectTimeBtn = page.locator(".staff-button-right div").nth(2);
    this.sideBar = page.locator(".BookingWindow");
    this.manageAptButton = page.locator("[data-bem='ManageAppointmentButton__manage']");
    this.deleteAptButton = page.locator("[data-tag='ManageAppointmentButton__item-delete']");
    this.resheduleAptButton = page.locator("[data-tag='ManageAppointmentButton__item-reschedule']");
    this.appointmentSidebar = page.locator("[data-bem ='Sidebar__toolbar']");
    this.selectedCalendarDate = page.locator(".selected-date");
    this.sendReceiptModal = page.locator("[data-cy = 'send-receipt-modal']");
    this.clientEmailInput = page.getByPlaceholder('Client Email Address');
    this.checkoutpopup = page.locator(".chk-popup-success-text");
    this.appointmentPaidStatus = page.locator("[data-appointment-status = 'paid']");
    this.appointment = page.locator("div[id*='appointment_']");
    this.deleteIcon = page.getByRole("button").nth(3);
    this.appointmentHeader = page.locator("[data-bem='AppointmentHeader']");
    this.closeWizardBtn = page.locator(".Wizard_closeButtonContainer__GFC2i");
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
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);
      await expect(this.clientList).toContainText(clientName);
      await this.page.getByRole('button', { name: clientName }).last().click();
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


    async bookAnAppointment(clientName, serviceCategory, serviceName, stylistName) {
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
      await expect(this.newButton).toBeVisible();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);

      try{
      var isClientVisible = await expect(this.clientList).toContainText(clientName);
      } catch (error) {
        console.log(`Client ${clientName} not found in the list.`);
        isClientVisible = false;
      }

      // If client is not found, create a new client  
      if (isClientVisible===false) {
      console.log(`Client ${clientName} not found. Creating a new client.`);
      await this.closeSideBarBtn.click();
      await this.addNewClient(clientName);
      await expect(this.newButton).toBeVisible();
      await this.newButton.click();
      await this.appointmentSelection.click();
      await this.clientSearchBox.fill(clientName);         
      } else {
          console.log(`Client ${clientName} found.`); 
      }
      await this.page.getByRole('button', { name: clientName }).last().click();
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
      const appointmentDetails = this.appointment.filter({ hasText: clientName });
      const isAppointmentVisible = await appointmentDetails.isVisible();

      if (!isAppointmentVisible) {

        console.log(`No appointment found for ${clientName}. Creating a new appointment.`);
        await this.bookAnAppointment(clientName, 'Colouring', 'Full Head Highlights', 'John Doe');
      }
    else {
      console.log(`Appointment found for ${clientName}. Proceeding to delete.`);
      }

    console.log(`Deleting appointment for ${clientName}.`);
    await appointmentDetails.click();
    await expect(this.appointmentSidebar).toBeVisible();
    await this.manageAptButton.click();
    await this.deleteAptButton.click();
    await this.page.getByText('DELETE BOOKING').click();

    await expect(appointmentDetails).not.toBeVisible();
  }


    async rescheduleAppointment(clientName, date) {
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
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


    async checkoutAppointment(clientName) {
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await this.page.getByText('CHECKOUT & REBOOK').click();
      await this.page.getByText('GO TO CHECKOUT').click();
      await this.page.getByText('COMPLETE').click();
      await this.page.locator('span').filter({hasText: "CONFIRM"}).click();
      expect(await this.sendReceiptModal).toBeVisible();
      await this.clientEmailInput.fill('testsalon3@proton.me');
      await this.page.getByRole('button', { name: 'SEND RECEIPT' }).click();
      await expect(this.checkoutpopup).toBeVisible();
      await this.page.getByText('Close').click();
      await expect(this.bookingCalendar).toBeVisible();
      expect(await this.appointmentPaidStatus).toBeVisible();
      
    }


    async deleteCheckedOutAppointment(clientName) {

      const appointmentDetails = this.appointment.filter({ hasText: clientName });
      const isAppointmentVisible = await appointmentDetails.isVisible();

      if (isAppointmentVisible) {
        console.log(`Deleting checked out appointment for ${clientName}.`);
        await appointmentDetails.click();
        await expect(this.appointmentSidebar).toBeVisible();
        await this.deleteIcon.click();
        await this.page.getByText('DELETE BOOKING').click();
        await expect(appointmentDetails).not.toBeVisible();
      }
      else {
        console.log(`No checked out appointment found for ${clientName}.`);
        return;
      }
       await this.page.waitForTimeout(4000);
       await this.deleteCheckedOutAppointment(clientName);
    }
 

    async deleteAllTestAppointments() {
      const existingAppointments = await this.appointment; 
      console.log(`Total existing appointments: ${await existingAppointments.count()}`);
      await this.page.waitForTimeout(10000);
      await expect(this.bookingCalendar).toBeVisible();
      for (let i = 0; i <= await existingAppointments.count(); i++) {
        var initialCount = await existingAppointments.count();
        console.log(`Checking appointment ${i + 1} for deletion.`);
        const appointmentDetails = existingAppointments.nth(i);
        const clientName = await appointmentDetails.textContent();
        const isAppointmentVisible = await appointmentDetails.isVisible();

        if (isAppointmentVisible) {
          console.log(`Deleting existing appointment for ${clientName}.`);
          await appointmentDetails.click();
          await expect(this.appointmentSidebar).toBeVisible();
          await this.page.waitForTimeout(2000);
          if (await this.manageAptButton.isVisible()) {
            await this.manageAptButton.click();
            await this.deleteAptButton.click();
          } else {
            console.log(`Manage Appointment button not visible for ${clientName}. Checked out appointment`);
             await this.deleteIcon.click();
          }
        
          await this.page.getByText('DELETE').last().click();
          expect(await this.bookingCalendar).toBeVisible();
          expect(await appointmentDetails.count()).toBeLessThan(await initialCount);
        } else {
          console.log(`No existing appointment found for ${clientName}.`);
          break;
        }
      }
    } 
    
    async confirmAppointment(clientName) {
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await this.page.locator("[data-bem = 'ToggleSwitch__name']").filter({hasText: 'Confirm'}).click();
      await expect(this.appointmentHeader).toBeVisible();
      await expect(this.appointmentHeader).toContainText(clientName);
      await this.page.screenshot({ path: `screenshots/appointment_confirm_${clientName}.png` });
      await expect(this.appointmentHeader).not.toContainText('Unconfirmed', { timeout: 5000 });
      await this.deleteAppointment(clientName);
    }

    async cancelAppointment(clientName) { 
      var appointmentDetails = this.appointment.filter({ HasText: clientName}).first();
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await this.manageAptButton.click();
      await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await this.page.getByText('CANCEL APPOINTMENT').click();
      await this.closeWizardBtn.click();
      await expect(this.bookingCalendar).toBeVisible();
      await appointmentDetails.click();
      await expect(this.appointmentSidebar).toBeVisible();
      await expect(this.appointmentHeader).toBeVisible();
      await expect(this.appointmentHeader).toContainText('Cancelled');
      await this.page.screenshot({ path: `screenshots/appointment_cancel_${clientName}.png` });
      //await expect(appointmentDetails).not.toBeVisible();
    }

    async createMultipleAppointments(clientName, numberOfAppointments) {
      for (let i = 1; i <= numberOfAppointments; i++) {
        const uniqueClientName = `${clientName}_${i}`;
        console.log(`Creating appointment for ${uniqueClientName}`);
        await this.bookAnAppointment(uniqueClientName, 'Colouring', 'Full Head Highlights', 'John Doe');
      }
    }
  }

module.exports = CalendarPage;