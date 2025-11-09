// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import {
  Money,
  FormattedMessage as T,
  PageForm,
  PageFormBigNumber,
} from '@/components';

import PaymentMadeFormHeaderFields from './PaymentMadeFormHeaderFields';
import { usePaymentmadeTotalAmount } from './utils';

/**
 * Payment made header form.
 */
function PaymentMadeFormHeader() {
  // Formik form context.
  const {
    values: { currency_code },
  } = useFormikContext();

  const totalAmount = usePaymentmadeTotalAmount();

  return (
    <PageForm.Header>
      <PaymentMadeFormHeaderFields />
      <PageFormBigNumber
        label={<T id={'amount_received'} />}
        amount={<Money amount={totalAmount} currency={currency_code} />}
      />
    </PageForm.Header>
  );
}

export default PaymentMadeFormHeader;
