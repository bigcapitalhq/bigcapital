import React from 'react';

import { Card } from 'components';

import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveDetailHeader from './PaymentReceiveDetailHeader';
import PaymentReceiveDetailTable from './PaymentReceiveDetailTable';
import PaymentReceiveDetailFooter from './PaymentReceiveDetailFooter';

export default function PaymentReceiveDetailTab() {
  return (
    <div className={'payment-drawer'}>
      <PaymentReceiveActionsBar />
      <div>
        <Card>
          <PaymentReceiveDetailHeader />
          <PaymentReceiveDetailTable />
          {/* <PaymentReceiveDetailFooter /> */}
        </Card>
      </div>
    </div>
  );
}
