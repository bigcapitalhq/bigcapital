import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import BillFormHeaderFields from './BillFormHeaderFields';
import { PageFormBigNumber } from 'components';

/**
 * Fill form header.
 */
export default function BillFormHeader({ onBillNumberChanged }) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(values.entries, 'total'), [
    values.entries,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields onBillNumberChanged={onBillNumberChanged} />
      <PageFormBigNumber
        label={'Due Amount'}
        amount={totalDueAmount}
        currencyCode={'LYD'}
      />
    </div>
  );
}
