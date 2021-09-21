import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { DrawerMainTabs } from 'components';
import PaymentReceiveDetailTab from './PaymentReceiveDetailTab';

import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import PaymentDrawerCls from './PaymentReceiveDrawer.module.scss';

/**
 * Payment receive view detail.
 */
export default function PaymentReceiveDetail() {
  const { transactions } = usePaymentReceiveDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.root)}>
      <DrawerMainTabs defaultSelectedTabId="details">
        <Tab
          id={'details'}
          title={intl.get('details')}
          panel={<PaymentReceiveDetailTab />}
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
