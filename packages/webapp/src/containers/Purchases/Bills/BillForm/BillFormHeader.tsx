// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { PageForm, PageFormBigNumber } from '@/components';

import BillFormHeaderFields from './BillFormHeaderFields';
import { useBillTotalFormatted } from './utils';

/**
 * Fill form header.
 */
function BillFormHeader() {
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

export default BillFormHeader;
