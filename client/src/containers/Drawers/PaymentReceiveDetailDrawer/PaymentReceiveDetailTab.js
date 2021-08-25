import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import PaymentReceiveDetailHeader from './PaymentReceiveDetailHeader';
import PaymentReceiveDetailTable from './PaymentReceiveDetailTable';
import PaymentReceiveDetailFooter from './PaymentReceiveDetailFooter';

import PaymentDrawerCls from './PaymentReceiveDrawer.module.scss';

export default function PaymentReceiveDetailTab() {
  return (
    <div className={clsx(PaymentDrawerCls.detail_panel)}>
      <PaymentReceiveActionsBar />

      <Card>
        <PaymentReceiveDetailHeader />
        <PaymentReceiveDetailTable />
        <PaymentReceiveDetailFooter />
      </Card>
    </div>
  );
}
