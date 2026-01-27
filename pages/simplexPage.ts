import { expect, Page } from "@playwright/test";
import { simplexLocators } from "../locators/simplexLocators";
import { Currency } from "../src/enums/currency";

export class SimplexPage {
    public readonly locators: ReturnType<typeof simplexLocators>;

    constructor(public readonly page: Page) {
        this.locators = simplexLocators(this.page);
    }

    async simplexPageIsOpened() {
        await expect(this.locators.mainPage.siteLogo).toBeVisible();
        await expect(this.locators.mainPage.siteLogo).toHaveAttribute('title', 'Simplex');
    }

    async clickOnBuyCryptoButton() {
        await expect(this.locators.mainPage.buyCryptoButton).toBeVisible();
        await this.locators.mainPage.buyCryptoButton.click();
    }

    async buyCryptoPageIsOpened() {
        await expect(this.locators.buyCryptoPage.siteLogo).toBeVisible();
        await expect(this.locators.buyCryptoPage.siteLogo).toHaveAttribute('title', 'Simplex');
        await expect(this.locators.buyCryptoPage.heading).toHaveText('Buy Crypto Instantly - Fast, Secure, and Trusted');
    }

    async cryptoCalculatorIsDisplayed() {
        await expect(this.locators.buyCryptoPage.exchangeForm.form).toBeVisible();
    }

    async cryptoDropdownIsEqualTo(currency: Currency) {
        const dropdown = this.locators.buyCryptoPage.exchangeForm.cryptoDropdown;
        await expect(dropdown).toBeVisible();
        await expect(dropdown).toHaveValue(new RegExp(currency.code));
    }

    async cryptoInputDefaultLookIsCorrect() {
        const inputValue = await this.getCryptoInputValue();
        expect(Number(inputValue)).toBeGreaterThan(0);
    }

    async fillCryptoInputByValue(text: string) {
        const input = this.locators.buyCryptoPage.exchangeForm.cryptoInput;
        await input.clear()
        await input.fill(text)
    }

    async fillFiatInputByValue(text: string) {
        const input = this.locators.buyCryptoPage.exchangeForm.fiatInput;
        await input.clear()
        await input.fill(text)
    }

    async getCryptoInputValue() {
        const input = this.locators.buyCryptoPage.exchangeForm.cryptoInput;
        await expect(input).toBeVisible();
        return await input.inputValue();
    }

    async cryptoValueIsNotEqualTo(valueToCompare: string) {
        const input = this.locators.buyCryptoPage.exchangeForm.cryptoInput;
        await expect(async () => {
            await expect(input).not.toHaveValue(valueToCompare);
        }).toPass({
            timeout: 5000,
            intervals: [500]
        });
    }

    async fiatDropdownIsEqualTo(currency: Currency) {
        const dropdown = this.locators.buyCryptoPage.exchangeForm.fiatDropdown;
        await expect(dropdown).toBeVisible();
        await expect(dropdown).toHaveValue(new RegExp(currency.code));
    }

    async changeCryptoCurrency(currency: string) {
        const dropdown = this.locators.buyCryptoPage.exchangeForm.cryptoDropdown;

        await dropdown.click();
        await dropdown.fill(currency)
        const searchResult = this.locators.buyCryptoPage.exchangeForm.searchResults
            .locator(`[data-currency="${currency}"]`);
        await expect(searchResult).toBeVisible();
        await searchResult.click();

    }

    async fiatInputValueIsEqualTo(value: string) {
        const input = this.locators.buyCryptoPage.exchangeForm.fiatInput;
        await expect(input).toBeVisible();
        await expect(input).toHaveValue(value);

    }

    async addressInputIsEqualTo(value: string) {
        const addressInput = this.locators.buyCryptoPage.exchangeForm.addressInput;
        await expect(addressInput).toBeVisible();
        await expect(addressInput).toHaveValue(value);
    }

    async fillAddressByValue(text: string) {
        const input = this.locators.buyCryptoPage.exchangeForm.addressInput;
        await input.clear()
        await input.fill(text)
    }

    async continueButtonIsDisplayed() {
        const button = this.locators.buyCryptoPage.exchangeForm.continueButton;
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
    }

    async clickOnContinueButton() {
        await this.locators.buyCryptoPage.exchangeForm.continueButton.click()
    }

    async currencyInputErrorCountIsEqualTo(count: number) {
        await expect(this.locators.buyCryptoPage.exchangeForm.inputErrors).toHaveCount(count);
    }

    async addressInputErrorIsDisplyed(visibility: boolean, errText: string = '') {
        const err = this.locators.buyCryptoPage.exchangeForm.addressError;
        if (visibility == true) {
            await expect(err).toBeVisible();
            await expect(err).toHaveValue(errText);
        } else {
            await expect(err).toBeHidden();
        }
    }

    async cryptoErrorMsgIsEqualTo(msg: string) {
        const err = this.locators.buyCryptoPage.exchangeForm.cryptoInputError;
        await expect(err).toHaveText(msg)
    }

    async fiatErrorMsgIsEqualTo(msg: string) {
        const err = this.locators.buyCryptoPage.exchangeForm.fiatInputError;
        await expect(err).toHaveText(msg)
    }

}