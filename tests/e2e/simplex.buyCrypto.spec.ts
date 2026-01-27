import { test, expect } from '@playwright/test';
import { SimplexPage } from '../../pages/simplexPage';
import { Crypto, Fiat } from '../../src/enums/currency';

const baseURL = process.env.SIMPLEX_BUY_URL || 'https://buy.simplex.com';
let simplexPage: SimplexPage;

test.describe('Simplex buy crypto page tests', () => {

    test.beforeEach(async ({ page }) => {
        simplexPage = new SimplexPage(page);
        await page.goto(baseURL);

        await simplexPage.buyCryptoPageIsOpened();
        await simplexPage.cryptoCalculatorIsDisplayed();

    })

    test('Default look fo crypto calculator looks correctly', async () => {
        await simplexPage.cryptoDropdownIsEqualTo(Crypto.BTC);
        await simplexPage.fiatDropdownIsEqualTo(Fiat.EUR);
        await simplexPage.cryptoInputDefaultLookIsCorrect();
        await simplexPage.fiatInputValueIsEqualTo('300');
        await simplexPage.addressInputIsEqualTo('')
        await simplexPage.continueButtonIsDisplayed();
        await simplexPage.currencyInputErrorCountIsEqualTo(0);
        await simplexPage.addressInputErrorIsDisplyed(false)
    });

    test('Calculator input value reflects on the curreny changes', async () => {
        const cryptoValue = await simplexPage.getCryptoInputValue();

        await simplexPage.changeCryptoCurrency(Crypto.ETH.code)
        await simplexPage.cryptoValueIsNotEqualTo(cryptoValue);
        await simplexPage.fiatInputValueIsEqualTo('300');

    });


    test('currency inputs are required', async () => {
        await simplexPage.fillCryptoInputByValue('')
        await simplexPage.currencyInputErrorCountIsEqualTo(1);
        await simplexPage.fillFiatInputByValue('')
        await simplexPage.currencyInputErrorCountIsEqualTo(2);
        await simplexPage.cryptoErrorMsgIsEqualTo(`Please enter ${Crypto.BTC.fullName} amount`);
        await simplexPage.fiatErrorMsgIsEqualTo(`Please enter ${Fiat.EUR.fullName} amount`)
        //additional check if error msgs are dynamic
        await simplexPage.changeCryptoCurrency(Crypto.ETH.code)
        await simplexPage.currencyInputErrorCountIsEqualTo(2);
        await simplexPage.cryptoErrorMsgIsEqualTo(`Please enter ${Crypto.ETH.fullName} amount`);
    });

    test('Wrong address should throw an error message', async () => {
        await simplexPage.fillAddressByValue('test')
        await simplexPage.clickOnContinueButton();

        //Test will fail here, since calculator deos not throws any error if address is incorrect
        await simplexPage.addressInputErrorIsDisplyed(true, 'Wrong address?')
    });




});