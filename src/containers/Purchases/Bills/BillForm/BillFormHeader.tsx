import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';

import BillFormHeaderFields from './BillFormHeaderFields';
import { PageFormBigNumber } from '@/components';

/**
 * Fill form header.
 */
function BillFormHeader() {
  const {
    values: { currency_code, entries },
  } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(entries, 'amount'), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('due_amount')}
        amount={totalDueAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}
export default BillFormHeader;
