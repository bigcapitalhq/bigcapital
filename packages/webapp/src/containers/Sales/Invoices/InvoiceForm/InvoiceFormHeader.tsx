// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';
import { x } from '@xstyled/emotion';

import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';
import { PageFormBigNumber } from '@/components';
import { useInvoiceDueAmount } from './utils';

/**
 * Invoice form header section.
 */
function InvoiceFormHeader() {
  return (
    <x.div
      display="flex"
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <InvoiceFormHeaderFields />
      <InvoiceFormBigTotal />
    </x.div>
  );
}

/**
 * Big total of invoice form header.
 * @returns {React.ReactNode}
 */
function InvoiceFormBigTotal() {
  const {
    values: { currency_code },
  } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  const totalDueAmount = useInvoiceDueAmount();

  return (
    <PageFormBigNumber
      label={intl.get('due_amount')}
      amount={totalDueAmount}
      currencyCode={currency_code}
    />
  );
}
export default InvoiceFormHeader;
