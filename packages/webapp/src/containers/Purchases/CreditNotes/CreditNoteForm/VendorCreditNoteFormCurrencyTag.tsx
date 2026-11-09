import { useFormikContext } from 'formik';
import React from 'react';
import {
  useVendorNoteIsForeignCustomer,
  type VendorCreditFormValues,
} from './utils';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Vendor credit note currency tag.
 */
export function VendorCreditNoteFormCurrencyTag() {
  const { vendors } = useVendorCreditNoteFormContext();
  const { values } = useFormikContext<VendorCreditFormValues>();
  const isForeignVendor = useVendorNoteIsForeignCustomer();

  const selectVendor = vendors.find((v) => v.id === values.vendorId);

  if (!isForeignVendor) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectVendor?.currencyCode} />
    </BaseCurrencyRoot>
  );
}
