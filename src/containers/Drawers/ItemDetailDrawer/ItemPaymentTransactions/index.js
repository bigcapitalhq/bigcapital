import React from 'react';
import { Tab } from '@blueprintjs/core';
import { DrawerMainTabs, FormattedMessage as T } from 'components';
import InvoicePaymentTransactionsTable from './InvoicePaymentTransactionsDataTable';
import EstimatePaymentTransactionsTable from './EstimatePaymentTransactionsDataTable';
import ReceiptPaymentTransactionsTable from './ReceiptPaymentTransactionsDataTable';
import BillPaymentTransactionsTable from './BillPaymentTransactionsDataTable';

import ItemSwitchMenuItem from './utils';

export const ItemPaymentTransactions = () => {
  return (
    <DrawerMainTabs>
      <Tab
        id={'invoice'}
        title={<T id={'invoice'} />}
        panel={<InvoicePaymentTransactionsTable />}
      />
      <Tab
        id={'estiamte'}
        title={'Estimate'}
        title={<T id={'estimate_'} />}
        panel={<EstimatePaymentTransactionsTable />}
      />
      <Tab
        id={'receipt'}
        title={<T id={'receipt_'} />}
        panel={<ReceiptPaymentTransactionsTable />}
      />
      <Tab
        id={'bill'}
        title={'Bill'}
        panel={<BillPaymentTransactionsTable />}
      />
    </DrawerMainTabs>
  );
};
