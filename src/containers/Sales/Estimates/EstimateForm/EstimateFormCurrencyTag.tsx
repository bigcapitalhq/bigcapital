// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form currency tag.
 * @returns
 */
export default function EstimateFromCurrencyTag() {
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
