// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Group, Money } from '@/components';
import { FormattedMessage as T } from '@/components';

import { CLASSES } from '@/constants/classes';
import PaymentReceiveHeaderFields from './PaymentReceiveHeaderFields';

/**
 * Payment receive form header.
 */
function PaymentReceiveFormHeader() {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <PaymentReceiveHeaderFields />
      <PaymentReceiveFormBigTotal />
    </Group>
  );
}

/**
 * Big total amount of payment receive form.
 * @returns {React.ReactNode}
 */
function PaymentReceiveFormBigTotal() {
  // Formik form context.
  const {
    values: { currency_code, amount },
  } = useFormikContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
      <div class="big-amount">
        <span class="big-amount__label">
          <T id={'amount_received'} />
        </span>
        <h1 class="big-amount__number">
          <Money amount={amount} currency={currency_code} />
        </h1>
      </div>
    </div>
  );
}

export default PaymentReceiveFormHeader;
