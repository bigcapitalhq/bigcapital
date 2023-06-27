// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useBillFormContext } from './BillFormProvider';

/**
 * Bill form currency tag.
 * @returns
 */
export default function BillFormCurrencyTag() {
  const { isForeignVendor, selectVendor } = useBillFormContext();

  if (!isForeignVendor) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectVendor?.currency_code} />
    </BaseCurrencyRoot>
  );
}
