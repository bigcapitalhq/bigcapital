// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';

import { CLASSES } from '@/constants/classes';
import { PageFormBigNumber } from '@/components';
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
