import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

import { PageFormBigNumber } from 'components';

export default function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(values.entries, 'total'), [
    values.entries,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />
      <PageFormBigNumber
        label={'Due Amount'}
        amount={totalDueAmount}
        currencyCode={'LYD'}
      />
    </div>
  );
}
