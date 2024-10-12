// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';
import { Group, PageFormBigNumber } from '@/components';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';
import { useInvoiceDueAmount } from './utils';

/**
 * Invoice form header section.
 */
function InvoiceFormHeader() {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <InvoiceFormHeaderFields />
      <InvoiceFormBigTotal />
    </Group>
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
