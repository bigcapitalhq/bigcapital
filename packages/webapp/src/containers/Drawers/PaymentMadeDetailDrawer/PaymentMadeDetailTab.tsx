import React from 'react';
import { PaymentMadeDetailFooter } from './PaymentMadeDetailFooter';
import { PaymentMadeDetailHeader } from './PaymentMadeDetailHeader';
import { PaymentMadeDetailTable } from './PaymentMadeDetailTable';
import { PaymentMadeDetailTableFooter } from './PaymentMadeDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Payment made detail tab.
 */
export function PaymentMadeDetailTab() {
  return (
    <CommercialDocBox>
      <PaymentMadeDetailHeader />
      <PaymentMadeDetailTable />
      <PaymentMadeDetailTableFooter />
      <PaymentMadeDetailFooter />
    </CommercialDocBox>
  );
}
