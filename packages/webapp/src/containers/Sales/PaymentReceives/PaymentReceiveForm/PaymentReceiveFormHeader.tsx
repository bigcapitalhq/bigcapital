// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import { Money } from '@/components';
import { FormattedMessage as T } from '@/components';

import { CLASSES } from '@/constants/classes';
import PaymentReceiveHeaderFields from './PaymentReceiveHeaderFields';

/**
 * Payment receive form header.
 */
function PaymentReceiveFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        <PaymentReceiveHeaderFields />
        <PaymentReceiveFormBigTotal />
      </div>
    </div>
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
