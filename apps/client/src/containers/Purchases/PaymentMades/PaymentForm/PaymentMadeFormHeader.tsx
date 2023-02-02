// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { sumBy } from 'lodash';
import { CLASSES } from '@/constants/classes';
import { Money, FormattedMessage as T } from '@/components';

import PaymentMadeFormHeaderFields from './PaymentMadeFormHeaderFields';

/**
 * Payment made header form.
 */
function PaymentMadeFormHeader() {
  // Formik form context.
  const {
    values: { entries, currency_code },
  } = useFormikContext();

  // Calculate the payment amount of the entries.
  const amountPaid = useMemo(() => sumBy(entries, 'payment_amount'), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        <PaymentMadeFormHeaderFields />

        <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
          <div class="big-amount">
            <span class="big-amount__label">
              <T id={'amount_received'} />
            </span>
            <h1 class="big-amount__number">
              <Money amount={amountPaid} currency={currency_code} />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMadeFormHeader;
