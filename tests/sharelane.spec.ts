import { expect } from 'chai';
import {Browser, Builder, By, until, WebDriver} from 'selenium-webdriver';

async function createDriver() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 10000 });
    return driver;
}

describe('Test Suite for Sharelane', async () => {
    let driver: any;
    before(async function () {
        driver = await createDriver();
    });

    after(async function () {
        await driver.quit();
    });

    it('New user registration with filling in all fields (mandatory + optional)', async function () {
        await driver.get('https://sharelane.com/cgi-bin/main.py');

        await driver.findElement(By.css('a[href="./register.py"]')).click();

        await driver.findElement(By.name('zip_code')).sendKeys('12345');
        await driver.findElement(By.css('input[value="Continue"]')).click();

        await driver.findElement(By.name('first_name')).sendKeys('Test');
        await driver.findElement(By.name('last_name')).sendKeys('User');
        await driver.findElement(By.name('email')).sendKeys('testuser@example.com');
        await driver.findElement(By.name('password1')).sendKeys('Password123');
        await driver.findElement(By.name('password2')).sendKeys('Password123');
        await driver.findElement(By.css('input[value="Register"]')).click();

        const confirmationMessage = await driver.findElement(By.css('.confirmation_message')).getText();
        expect(confirmationMessage).to.include('Account is created!');
    });


    it('New user registration - invalid email', async function () {
        await driver.get('https://sharelane.com/cgi-bin/main.py');

        await driver.findElement(By.css('a[href="./register.py"]')).click();

        await driver.findElement(By.name('zip_code')).sendKeys('12345');
        await driver.findElement(By.css('input[value="Continue"]')).click();

        await driver.findElement(By.name('first_name')).sendKeys('Test');
        await driver.findElement(By.name('last_name')).sendKeys('User');
        await driver.findElement(By.name('email')).sendKeys('testuser');
        await driver.findElement(By.name('password1')).sendKeys('Password123');
        await driver.findElement(By.name('password2')).sendKeys('Password123');
        await driver.findElement(By.css('input[value="Register"]')).click();

        const confirmationMessage = await driver.findElement(By.css('.error_message')).getText();
        expect(confirmationMessage).to.include('Oops, error on page. Some of your fields have invalid data or email was previously used');
    });

    it('User login - valid data', async function () {
        this.timeout(5000);
        await driver.get('https://sharelane.com/cgi-bin/main.py');

        await driver.findElement(By.css('a[href="./register.py"]')).click();

        await driver.findElement(By.name('zip_code')).sendKeys('12345');
        await driver.findElement(By.css('input[value="Continue"]')).click();

        await driver.findElement(By.name('first_name')).sendKeys('Test');
        await driver.findElement(By.name('last_name')).sendKeys('User');
        await driver.findElement(By.name('email')).sendKeys('testuser@example.com');
        await driver.findElement(By.name('password1')).sendKeys('Password123');
        await driver.findElement(By.name('password2')).sendKeys('Password123');
        await driver.findElement(By.css('input[value="Register"]')).click();

        const confirmationMessage = await driver.findElement(By.css('.confirmation_message')).getText();
        expect(confirmationMessage).to.include('Account is created!');

        const emailElement = await driver.findElement(By.xpath("//td[text()='Email']/following-sibling::td/b"));
        const passwordElement = await driver.findElement(By.xpath("//td[text()='Password']/following-sibling::td"));

        const email = await emailElement.getText();
        const password = await passwordElement.getText();

        await driver.get('https://sharelane.com/cgi-bin/main.py');
        await driver.findElement(By.name('email')).sendKeys(email);
        await driver.findElement(By.name('password')).sendKeys(password);
        await driver.findElement(By.css('input[value="Login"]')).click();
        await driver.wait(until.elementLocated(By.css('.user')), 10000);
        const welcomeMessage = await driver.findElement(By.css('.user')).getText();
        expect(welcomeMessage).to.include('Hello');
        await driver.findElement(By.css("tr.grey_bg a[href='./log_out.py']"));
        const logoutElement = await driver.findElement(By.css("tr.grey_bg a[href='./log_out.py']"));
        await logoutElement.click();
    });

});