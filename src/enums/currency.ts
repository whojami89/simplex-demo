export class Currency {
    constructor(public readonly code: string, public readonly fullName: string) { }

    toString() {
        return this.fullName;
    }
}

export const Crypto = {
    ONE_INCH: new Currency('1INCH', '1inch'),
    AAVE: new Currency('AAVE', 'Aave'),
    BTC: new Currency('BTC', 'Bitcoin'),
    ELON: new Currency('ELON', 'Dogelon Mars'),
    ETH: new Currency('ETH', 'Ethereum')

    // ... and many others

} as const;

export const Fiat = {
    EUR: new Currency('EUR', 'Euro'),
    GBP: new Currency('GBP', 'Pound Sterling'),
    PLN: new Currency('PLN', 'Polish Złoty'),
    CHF: new Currency('CHF', 'Swiss Franc'),

    // ... and many others

} as const;