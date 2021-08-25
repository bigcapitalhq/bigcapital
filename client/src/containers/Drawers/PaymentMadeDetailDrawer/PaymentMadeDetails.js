import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { DrawerMainTabs } from 'components';
import PaymentMadeDetailTab from './PaymentMadeDetailTab';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made - view detail.
 */
export default function PaymentMadeDetails() {
  const { transactions } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.root)}>
      <DrawerMainTabs defaultSelectedTabId="details">
        <Tab
          id={'details'}
          title={intl.get('details')}
          panel={<PaymentMadeDetailTab />}
        />
        <Tab
          id={'journal_entries'}
          title={intl.get('journal_entries')}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
      </DrawerMainTabs>
    </div>
  );
}
