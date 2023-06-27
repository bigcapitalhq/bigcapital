// @ts-nocheck
import React from 'react';
import { CurrencyTag } from '@/components';

/**
 * base currency.
 * @returns
 */
export function BaseCurrency({ currency }) {
  return <CurrencyTag>{currency}</CurrencyTag>;
}
