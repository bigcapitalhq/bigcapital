// @ts-nocheck
import React from 'react';
import { CurrencyTag } from '@/components';

/**
 * base currecncy.
 * @returns
 */
export function BaseCurrency({ currency }) {
  return <CurrencyTag>{currency}</CurrencyTag>;
}
