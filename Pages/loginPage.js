import { expect } from "@playwright/test";
import { Locator, Page } from "playwright";
import dotenv from "dotenv";
dotenv.config();

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("input[data-pw-id='UserEmail']");
    this.passwordInput = page.locator("input[data-pw-id='PasswordInput']");
    this.loginButton = page.locator("button[data-pw-id ='login']");
    this.errorMessage = page.getByText(
      "Password needs to be at least 8 characters"
    );
    this.menuButton = page.locator("[data-bem ='SidebarMenu__button']");
    this.changeLocationBtn = page.getByText("Change Location");
    this.salonName = page.locator('div[class*="SalonName_salonName"]');
    this.salonList = page.locator("div.salon-list");
    this.salonSearchbox = page.getByRole("textbox", { name: "Search Salons" });
    this.pinCodePanel = page.locator('div[data-bem = "PinForm__content"]');
  }

  async navigateToLoginPage(baseURL) {
    baseURL = process.env.BASE_URL;
    await this.page.goto(baseURL);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    const isButtonEnabled = await this.loginButton.isEnabled();
    if (!isButtonEnabled) {
      this.getErrorMessage();
      return;
    }
    await this.loginButton.click();
  }

  async getErrorMessage() {
    expect(await this.errorMessage).toBeVisible();
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toBe(
      "Password needs to be at least 8 characters in length and contain an uppercase character and a number."
    );
  }

  async blankLoginAttempt(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeDisabled();
  }

  async singleSalonLoginValidation(salonIdentifier) {
    await expect(this.salonList).not.toBeVisible();
    await expect(this.salonName).toHaveText(salonIdentifier);
    await this.menuButton.click();
    await expect(this.changeLocationBtn).not.toBeVisible();
  }

  async multiSalonLoginValidation(salonIdentifier) {
    await expect(this.salonList).toBeVisible();
    await this.salonSearchbox.fill(salonIdentifier);
    await this.page
      .getByRole("button", { name: salonIdentifier })
      .first()
      .click();
    await this.page.waitForTimeout(6000);
    //await expect(this.bookingCalendar).toBeVisible();
    await expect(this.salonName).toHaveText(salonIdentifier);
    await this.menuButton.click();
    await expect(this.changeLocationBtn).toBeVisible();
    await this.changeLocationBtn.click();
  }

  async loginWithAccuratePin(salonIdentifier, pin) {
    await expect(this.salonList).toBeVisible();

    await this.salonSearchbox.fill(salonIdentifier);
    await this.page
      .getByRole("button", { name: salonIdentifier })
      .first()
      .click();
    await expect(this.pinCodePanel).toBeVisible();

    for (const ch of pin) {
      await this.page.getByRole("button", { name: ch.toString() }).click();

      await this.page.waitForTimeout(100);
    }

    await expect(this.salonName).toHaveText(salonIdentifier);
  }

  
}

module.exports = LoginPage;
