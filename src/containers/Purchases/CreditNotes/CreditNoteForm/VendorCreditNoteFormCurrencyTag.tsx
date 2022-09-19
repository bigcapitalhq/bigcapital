// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

/**
 * Vendor credit note currency tag.
 * @returns
 */
export default function VendorCreditNoteFormCurrencyTag() {
  const { isForeignVendor, selectVendor } = useVendorCreditNoteFormContext();

  if (!isForeignVendor) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectVendor?.currency_code} />
    </BaseCurrencyRoot>
  );
}
