import currencyList from './currency-data.json';
export const supportedCurrencyCodes = [
    'USD',
    'EUR',
    'JPY',
    'BGN',
    'CZK',
    'DKK',
    'GBP',
    'HUF',
    'PLN',
    'RON',
    'SEK',
    'CHF',
    'ISK',
    'NOK',
    'TRY',
    'AUD',
    'BRL',
    'CAD',
    'CNY',
    'HKD',
    'IDR',
    'ILS',
    'INR',
    'KRW',
    'MKD',
    'MXN',
    'MYR',
    'NZD',
    'PHP',
    'SGD',
    'THB',
    'VND',
    'ZAR',
    'COP',
];
export function defaultCurrencyList(locale = 'en-US', customChoice = null) {
    const currencies = customChoice
        ? [
            {
                name: customChoice,
                symbol_native: '',
                symbol: '',
                code: '',
                name_plural: customChoice,
                rounding: 0,
                decimal_digits: 2,
            },
        ]
        : [];
    const allCurrencies = currencyList[locale];
    return currencies.concat(Object.values(allCurrencies));
}
export function getCurrency(currencyCode, locale = 'en-US', customChoice = 'Custom') {
    const defaultCurrency = {
        name: customChoice,
        symbol_native: '',
        symbol: '',
        code: '',
        name_plural: customChoice,
        rounding: 0,
        decimal_digits: 2,
    };
    if (!currencyCode || currencyCode === '')
        return defaultCurrency;
    const currencyListInLocale = currencyList[locale] ?? currencyList['en-US'];
    return (currencyListInLocale[currencyCode] ??
        defaultCurrency);
}
