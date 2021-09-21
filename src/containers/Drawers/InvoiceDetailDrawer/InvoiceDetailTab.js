import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import InvoiceDetailActionsBar from './InvoiceDetailActionsBar';
import InvoiceDetailHeader from './InvoiceDetailHeader';
import InvoiceDetailTable from './InvoiceDetailTable';
import { InvoiceDetailFooter } from './InvoiceDetailFooter';

import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';

/**
 * Invoice readonly details tab panel.
 */
export default function InvoiceDetailTab() {
  return (
    <div className={clsx(InvoiceDrawerCls.detail_panel)}>
      <InvoiceDetailActionsBar />

      <Card>
        <InvoiceDetailHeader />
        <InvoiceDetailTable />
        <InvoiceDetailFooter />
      </Card>
    </div>
  );
}