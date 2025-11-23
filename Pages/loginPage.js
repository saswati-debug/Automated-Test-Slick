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
  }

  async navigateToLoginPage(baseURL) {
    await this.page.goto(process.env.BASE_URL);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    const errorSelector = '.error-message'; 
    return await this.page.textContent(errorSelector);
  }
}

module.exports = LoginPage;