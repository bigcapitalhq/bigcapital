import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from 'components';

/**
 * Invoice form header section.
 */
function InvoiceFormHeader() {
  const {
    values: { currency_code, entries },
  } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  const totalDueAmount = useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <InvoiceFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('due_amount')}
        amount={totalDueAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}
export default InvoiceFormHeader;
