// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';
import { PageFormBigNumber } from '@/components';

import BillFormHeaderFields from './BillFormHeaderFields';

/**
 * Fill form header.
 */
function BillFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields />
      <BillFormBigTotal />
    </div>
  );
}

function BillFormBigTotal() {
  const {
    values: { currency_code, entries },
  } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(entries, 'amount'), [entries]);

  return (
    <PageFormBigNumber
      label={intl.get('due_amount')}
      amount={totalDueAmount}
      currencyCode={currency_code}
    />
  );
}

export default BillFormHeader;
