import { expect } from '@playwright/test';
import { Locator, Page } from 'playwright';
import dotenv from 'dotenv';
dotenv.config();


class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("input[data-pw-id='UserEmail']"); 
    this.passwordInput = page.locator("input[data-pw-id='PasswordInput']");
    this.loginButton = page.locator("button[data-pw-id ='login']"); 
    this.errorMessage = page.getByText("Password needs to be at least 8 characters"); 
    this.menuButton = page.locator("[data-bem ='SidebarMenu__button']");
    this.changeLocationBtn = page.getByText("Change Location");
  }

  async navigateToLoginPage(baseURL) {
    baseURL = process.env.BASE_URL
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
     expect(errorText).toBe('Password needs to be at least 8 characters in length and contain an uppercase character and a number.');
  }

  async blankLoginAttempt(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeDisabled();
  }

  async singleSalonLoginValidation(salonIdentifier) {
    const salonName = this.page.locator('div[class*="SalonName_salonName"]');
    await expect(salonName).toHaveText(salonIdentifier);
    await this.menuButton.click();
    await expect(this.changeLocationBtn).not.toBeVisible();
  }
}

module.exports = LoginPage;