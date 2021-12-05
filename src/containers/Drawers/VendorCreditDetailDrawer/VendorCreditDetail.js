import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { DrawerMainTabs } from 'components';

import VendorCreditDetailPanel from './VendorCreditDetailPanel';
import RefundVendorCreditTransactionsTable from './RefundVendorCreditTransactions/RefundVendorCreditTransactionsTable';
import clsx from 'classnames';

import VendorCreditDetailCls from '../../../style/components/Drawers/VendorCreditDetail.module.scss';

/**
 * Vendor credit view detail.
 */
export default function VendorCreditDetail() {
  return (
    <div className={clsx(VendorCreditDetailCls.root)}>
      <DrawerMainTabs>
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<VendorCreditDetailPanel />}
        />
        <Tab
          title={intl.get('credit_note.drawer.label_refund_transactions')}
          id={'refund_transactions'}
          panel={<RefundVendorCreditTransactionsTable />}
        />
      </DrawerMainTabs>
    </div>
  );
}
