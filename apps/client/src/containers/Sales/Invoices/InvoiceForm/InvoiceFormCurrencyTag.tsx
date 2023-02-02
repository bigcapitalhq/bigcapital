// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';

import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { useInvoiceFormContext } from './InvoiceFormProvider';

/**
 * Invoice form currency tag.
 */
export default function InvoiceFormCurrencyTag() {
  const { isForeignCustomer } = useInvoiceFormContext();
  const {
    values: { currency_code },
  } = useFormikContext();

  if (!isForeignCustomer) {
    return null;
  }
  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={currency_code} />
    </BaseCurrencyRoot>
  );
}
