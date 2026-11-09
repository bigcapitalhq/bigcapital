import { useFormikContext } from 'formik';
import React from 'react';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import {
  usePaymentMadeIsForeignCustomer,
  type PaymentMadeFormValues,
} from './utils';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Payment made form currency tag.
 */
export function PaymentMadeFormCurrencyTag() {
  const { values } = useFormikContext<PaymentMadeFormValues>();
  const { vendors } = usePaymentMadeFormContext();
  const isForeignVendor = usePaymentMadeIsForeignCustomer();

  const selectVendor = vendors?.find((v) => v.id === Number(values.vendorId));

  if (!isForeignVendor) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectVendor?.currencyCode} />
    </BaseCurrencyRoot>
  );
}
