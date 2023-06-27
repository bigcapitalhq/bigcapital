// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

/**
 * Credit note from currency tag.
 * @returns
 */
export default function CreditNoteFormCurrencyTag() {
  const { isForeignCustomer, selectCustomer } = useCreditNoteFormContext();

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectCustomer?.currency_code} />
    </BaseCurrencyRoot>
  );
}
