// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useReceiptFormContext } from './ReceiptFormProvider';

/**
 * Receipt form currency tag.
 * @returns
 */
export default function ReceiptFormCurrencyTag() {
  const { isForeignCustomer, selectCustomer } = useReceiptFormContext();

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectCustomer?.currency_code} />
    </BaseCurrencyRoot>
  );
}
