// @ts-nocheck
import React from 'react';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';

/**
 * Payment reecevie form currency tag.
 * @returns
 */
export default function PaymentReceiveFormCurrencyTag() {
  const { isForeignCustomer, selectCustomer } = usePaymentReceiveFormContext();

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectCustomer?.currency_code} />
    </BaseCurrencyRoot>
  );
}
