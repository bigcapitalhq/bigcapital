import { useFormikContext } from 'formik';
import React from 'react';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { useCreditNoteIsForeignCustomer } from './utils';
import type { CreditNoteFormValues } from './utils';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Credit note from currency tag.
 */
export function CreditNotetFormCurrencyTag() {
  const { customers } = useCreditNoteFormContext();
  const { values } = useFormikContext<CreditNoteFormValues>();
  const isForeignCustomer = useCreditNoteIsForeignCustomer();

  const selectCustomer = customers.find((c) => c.id === values.customerId);

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectCustomer?.currencyCode} />
    </BaseCurrencyRoot>
  );
}
