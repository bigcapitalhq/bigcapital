import React from 'react';
import { BillDetailFooter } from './BillDetailFooter';
import { BillDetailHeader } from './BillDetailHeader';
import { BillDetailTable } from './BillDetailTable';
import { BillDetailTableFooter } from './BillDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Bill detail panel tab.
 */
export function BillDetailTab() {
  return (
    <CommercialDocBox>
      <BillDetailHeader />
      <BillDetailTable />
      <BillDetailTableFooter />
      <BillDetailFooter />
    </CommercialDocBox>
  );
}
