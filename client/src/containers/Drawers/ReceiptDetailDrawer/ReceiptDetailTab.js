import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import ReceiptDetailActionBar from './ReceiptDetailActionBar';
import ReceiptDetailHeader from './ReceiptDetailHeader';
import ReceiptDetailTable from './ReceiptDetailTable';
import { ReceiptDetailFooter } from './ReceiptDetailFooter';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';

export default function ReceiptDetailTab() {
  return (
    <div className={clsx(ReceiptDrawerCls.detail_panel)}>
      <ReceiptDetailActionBar />

      <Card>
        <ReceiptDetailHeader />
        <ReceiptDetailTable />
        <ReceiptDetailFooter />
      </Card>
    </div>
  );
}
