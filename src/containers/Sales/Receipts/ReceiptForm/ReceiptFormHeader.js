import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import { PageFormBigNumber } from 'components';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';

/**
 * Receipt form header section.
 */
function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
}) {
  const {
    values: { currency_code, entries },
  } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />
      <PageFormBigNumber
        label={intl.get('due_amount')}
        amount={totalDueAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}

export default ReceiptFormHeader;
