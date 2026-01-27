import { Page } from "@playwright/test"

export const simplexLocators = (page: Page) => {
    const calculatorFrame = page.frameLocator('iframe[src*="simplex-affiliates.com/form"]');
    return {
        mainPage: {
            siteLogo: page.locator('.site-logo img'),
            buyCryptoButton: page.locator('a:has-text("Buy Crypto")').filter({ visible: true }).first()
        },
        buyCryptoPage: {
            siteLogo: page.locator('.site-logo img'),
            heading: page.locator('.title-row .main-heading'),
            exchangeForm: {
                form: calculatorFrame.locator('#simplex-iframe-form'),
                cryptoInput: calculatorFrame.locator('#crypto_amount'),
                fiatInput: calculatorFrame.locator('#fiat_amount'),
                addressInput: calculatorFrame.locator('#cryptoAddress'),
                continueButton: calculatorFrame.locator('.simplex-continue-button'),
                cryptoDropdown: calculatorFrame.locator('.crypto-dd'),
                fiatDropdown: calculatorFrame.locator('.fiat-dd'),
                inputErrors: calculatorFrame.locator('.error-tooltip'),
                fiatInputError: calculatorFrame.locator('.fiat .error-tooltip'),
                cryptoInputError: calculatorFrame.locator('.crypto .error-tooltip'),
                addressError: calculatorFrame.locator('.error-message'),
                searchResults: calculatorFrame.locator('ul.autocomplete-results')
            }


        }

    }
}