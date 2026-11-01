import { useFormikContext } from 'formik';
import React from 'react';
import {
  useEstimateIsForeignCustomer,
  type PaymentReceiveFormValues,
} from './utils';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Payment receive form currency tag — renders the customer's currency badge
 * when the customer uses a foreign currency.
 */
export function PaymentReceiveFormCurrencyTag() {
  const isForeignCustomer = useEstimateIsForeignCustomer();
  const { values } = useFormikContext<PaymentReceiveFormValues>();

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={values.currencyCode} />
    </BaseCurrencyRoot>
  );
}
