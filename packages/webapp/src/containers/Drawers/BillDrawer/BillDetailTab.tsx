import React from 'react';
import { BillDetailFooter } from './BillDetailFooter';
import { BillDetailHeader } from './BillDetailHeader';
import { BillDetailTable } from './BillDetailTable';
import { BillDetailTableFooter } from './BillDetailTableFooter';
import { useBillDrawerContext } from './BillDrawerProvider';
import { CommercialDocBox } from '@/components';
import { BatchMovementsSection } from '@/ee/batches/components';

/**
 * Bill detail panel tab.
 */
export function BillDetailTab() {
  const { bill } = useBillDrawerContext();

  return (
    <CommercialDocBox>
      <BillDetailHeader />
      <BillDetailTable />
      <BillDetailTableFooter />
      <BatchMovementsSection entries={bill?.entries ?? []} direction={'in'} />
      <BillDetailFooter />
    </CommercialDocBox>
  );
}
