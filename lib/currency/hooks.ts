"use client";

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { DEFAULT_CURRENCY, type CurrencyCode } from './constants';
import { validateCurrencyCode } from './utils';

export function useCurrency() {
  const { settings } = useSettings();
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    if (settings?.business?.currency && validateCurrencyCode(settings.business.currency)) {
      setCurrency(settings.business.currency);
    }
  }, [settings]);

  return currency;
}