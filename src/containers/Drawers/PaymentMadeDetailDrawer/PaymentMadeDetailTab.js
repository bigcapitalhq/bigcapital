import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import PaymentMadeDetailActionsBar from './PaymentMadeDetailActionsBar';
import PaymentMadeDetailHeader from './PaymentMadeDetailHeader';
import PaymentMadeDetailTable from './PaymentMadeDetailTable';
import PaymentMadeDetailFooter from './PaymentMadeDetailFooter';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made detail tab.
 */
export default function PaymentMadeDetailTab() {
  return (
    <div className={clsx(PaymentDrawerCls.detail_panel)}>
      <PaymentMadeDetailActionsBar />

      <Card>
        <PaymentMadeDetailHeader />
        <PaymentMadeDetailTable />
        <PaymentMadeDetailFooter />
      </Card>
    </div>
  );
}
