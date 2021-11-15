import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { DrawerMainTabs } from 'components';

import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import InvoicePaymentTransactionsTable from './InvoicePaymentTransactionsTable';
import InvoiceDetailTab from './InvoiceDetailTab';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';

/**
 * Invoice view detail.
 */
export default function InvoiceDetail() {
  const { transactions } = useInvoiceDetailDrawerContext();

  return (
    <div className={clsx(InvoiceDrawerCls.invoice_details)}>
      <DrawerMainTabs defaultSelectedTabId="details">
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<InvoiceDetailTab />}
        />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
        <Tab
          title={intl.get('payment_transactions')}
          id={'payment_transactions'}
          panel={<InvoicePaymentTransactionsTable />}
        />
      </DrawerMainTabs>
    </div>
  );
}
