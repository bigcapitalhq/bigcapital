import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { DrawerMainTabs } from 'components';

import BillDetailTab from './BillDetailTab';
import LocatedLandedCostTable from './LocatedLandedCostTable';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import BillPaymentTransactionTable from './BillPaymentTransactionTable';
import { useBillDrawerContext } from './BillDrawerProvider';

import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';

/**
 * Bill view details.
 */
export default function BillDrawerDetails() {
  const {
    data: { transactions },
  } = useBillDrawerContext();

  return (
    <div className={clsx(BillDrawerCls.root)}>
      <DrawerMainTabs defaultSelectedTabId="details">
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<BillDetailTab />}
        />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
        <Tab
          title={intl.get('payment_transactions')}
          id={'payment_transactions'}
          panel={<BillPaymentTransactionTable />}
        />
        <Tab
          title={intl.get('located_landed_cost')}
          id={'landed_cost'}
          panel={<LocatedLandedCostTable />}
        />
      </DrawerMainTabs>
    </div>
  );
}
