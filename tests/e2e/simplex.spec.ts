import { test, expect } from '@playwright/test';
import { SimplexPage } from '../../pages/simplexPage';
import { Crypto, Fiat } from '../../src/enums/currency';

const baseURL = process.env.SIMPLEX_MAIN_URL || 'https://www.simplex.com';
let simplexPage: SimplexPage;

test.describe('Simplex main page tests', () => {

    test.beforeEach(async ({ page }) => {
        simplexPage = new SimplexPage(page);
        await page.goto(baseURL);
    })

    test('User can navigate from main page to the buy crypto calculator', async () => {
        await simplexPage.simplexPageIsOpened();
        await simplexPage.clickOnBuyCryptoButton();
        await simplexPage.buyCryptoPageIsOpened();
        await simplexPage.cryptoCalculatorIsDisplayed();

        await simplexPage.cryptoDropdownIsEqualTo(Crypto.BTC);
        await simplexPage.fiatDropdownIsEqualTo(Fiat.EUR);
        await simplexPage.cryptoInputDefaultLookIsCorrect();
        await simplexPage.fiatInputValueIsEqualTo('300');
        await simplexPage.addressInputIsEqualTo('')
        await simplexPage.continueButtonIsDisplayed();
        await simplexPage.currencyInputErrorCountIsEqualTo(0);
        await simplexPage.addressInputErrorIsDisplyed(false)
    });


});