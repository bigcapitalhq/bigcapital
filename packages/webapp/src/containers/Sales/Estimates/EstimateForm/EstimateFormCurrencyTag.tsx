// @ts-nocheck
import React from 'react';
import { useEstimateFormContext } from './EstimateFormProvider';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Estimate form currency tag.
 * @returns
 */
export function EstimateFromCurrencyTag() {
  const { isForeignCustomer, selectCustomer } = useEstimateFormContext();

  if (!isForeignCustomer) {
    return null;
  }
  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectCustomer?.currency_code} />
    </BaseCurrencyRoot>
  );
}
