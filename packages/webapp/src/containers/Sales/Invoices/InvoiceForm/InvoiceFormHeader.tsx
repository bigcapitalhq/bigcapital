// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Group, PageFormBigNumber } from '@/components';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';
import { useInvoiceTotalFormatted } from './utils';

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
  // Calculate the total due amount of invoice entries.
  const totalFormatted = useInvoiceTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('due_amount')} amount={totalFormatted} />
  );
}
export default InvoiceFormHeader;
