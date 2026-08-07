import React from 'react';
import intl from 'react-intl-universal';
import { BillFormHeaderFields } from './BillFormHeaderFields';
import { useBillTotalFormatted } from './utils';
import { PageForm, PageFormBigNumber } from '@/components';

/**
 * Fill form header.
 */
export function BillFormHeader() {
  return (
    <PageForm.Header>
      <BillFormHeaderFields />
      <BillFormBigTotal />
    </PageForm.Header>
  );
}

function BillFormBigTotal() {
  const totalFormatted = useBillTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('due_amount')} amount={totalFormatted} />
  );
}
