import React from 'react';

import { CommercialDocBox } from '@/components';

import BillDetailHeader from './BillDetailHeader';
import BillDetailTable from './BillDetailTable';
import { BillDetailTableFooter } from './BillDetailTableFooter';
import BillDetailFooter from './BillDetailFooter';

/**
 * Bill detail panel tab.
 */
export default function BillDetailTab() {
  return (
    <CommercialDocBox>
      <BillDetailHeader />
      <BillDetailTable />
      <BillDetailTableFooter />
      <BillDetailFooter />
    </CommercialDocBox>
  );
}
