import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import BillDetailActionsBar from './BillDetailActionsBar';
import BillDetailHeader from './BillDetailHeader';
import BillDetailTable from './BillDetailTable';
import { BillDetailFooter } from './BillDetailFooter'

import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';


/**
 * Bill detail panel tab.
 */
export default function BillDetailTab() {
  return (
    <div className={clsx(BillDrawerCls.detail_panel)}>
      <BillDetailActionsBar />

      <Card>
        <BillDetailHeader />
        <BillDetailTable />
        <BillDetailFooter />
      </Card>
    </div>
  );
}
