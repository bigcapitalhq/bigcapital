import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { DrawerMainTabs } from 'components';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import ReceiptDetailTab from './ReceiptDetailTab';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';

/**
 * Receipt view detail.
 */
export default function ReceiptDetail() {
  const { transactions } = useReceiptDetailDrawerContext();

  return (
    <div className={clsx(ReceiptDrawerCls.root)}>
      <DrawerMainTabs defaultSelectedTabId="details">
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<ReceiptDetailTab />}
        />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
      </DrawerMainTabs>
    </div>
  );
}
