import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';

import { PageFormBigNumber } from 'components';
import { useInvoiceTotal } from './utils';

/**
 * Invoice form header section.
 */
function InvoiceFormHeader() {
  const {
    values: { currency_code },
  } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  const totalDueAmount = useInvoiceTotal();

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
