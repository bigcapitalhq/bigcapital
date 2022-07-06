import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { Money, FormattedMessage as T } from '@/components';

import { CLASSES } from '@/common/classes';
import PaymentReceiveHeaderFields from './PaymentReceiveHeaderFields';

/**
 * Payment receive form header.
 */
function PaymentReceiveFormHeader() {
  // Formik form context.
  const {
    values: { currency_code, entries },
  } = useFormikContext();

  // Calculates the total payment amount from due amount.
  const paymentFullAmount = useMemo(
    () => sumBy(entries, 'payment_amount'),
    [entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        <PaymentReceiveHeaderFields />

        <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
          <div class="big-amount">
            <span class="big-amount__label">
              <T id={'amount_received'} />
            </span>
            <h1 class="big-amount__number">
              <Money amount={paymentFullAmount} currency={currency_code} />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReceiveFormHeader;
