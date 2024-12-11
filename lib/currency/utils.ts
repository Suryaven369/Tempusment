import { SUPPORTED_CURRENCIES, type CurrencyCode, type CurrencyInfo } from './constants';

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  locale: string = 'en-US'
): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  
  if (!currency) {
    console.warn(`Unsupported currency code: ${currencyCode}`);
    return `${amount}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
  }
}

export function parseCurrencyInput(value: string, currency: CurrencyInfo): number {
  // Remove currency symbol and any non-numeric characters except decimal point
  const cleanValue = value.replace(currency.symbol, '').replace(/[^\d.]/g, '');
  
  // Parse the clean value to a number
  const amount = parseFloat(cleanValue);
  
  // Round to the correct number of decimal places
  return Number(amount.toFixed(currency.decimals));
}

export function validateCurrencyCode(code: string): code is CurrencyCode {
  return code in SUPPORTED_CURRENCIES;
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[code]?.symbol || '';
}

export function getDecimalPlaces(code: CurrencyCode): number {
  return SUPPORTED_CURRENCIES[code]?.decimals || 2;
}