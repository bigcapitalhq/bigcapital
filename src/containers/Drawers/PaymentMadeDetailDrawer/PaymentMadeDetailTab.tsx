// @ts-nocheck
import React from 'react';

import { CommercialDocBox } from '@/components';

import PaymentMadeDetailHeader from './PaymentMadeDetailHeader';
import PaymentMadeDetailTable from './PaymentMadeDetailTable';
import PaymentMadeDetailTableFooter from './PaymentMadeDetailTableFooter';
import { PaymentMadeDetailFooter } from './PaymentMadeDetailFooter';

/**
 * Payment made detail tab.
 * @returns {React.JSX}
 */
export default function PaymentMadeDetailTab() {
  return (
    <CommercialDocBox>
      <PaymentMadeDetailHeader />
      <PaymentMadeDetailTable />
      <PaymentMadeDetailTableFooter />
      <PaymentMadeDetailFooter />
    </CommercialDocBox>
  );
}
