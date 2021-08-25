import React from 'react';

import { Card } from 'components';

import PaymentMadeDetailActionsBar from './PaymentMadeDetailActionsBar';
import PaymentMadeDetailHeader from './PaymentMadeDetailHeader';
import PaymentMadeDetailTable from './PaymentMadeDetailTable';

export default function PaymentMadeDetailTab() {
  return (
    <div className={'payment-drawer'}>
      <PaymentMadeDetailActionsBar />
      <div>
        <Card>
          <PaymentMadeDetailHeader />
          <PaymentMadeDetailTable />
        </Card>
      </div>
    </div>
  );
}
