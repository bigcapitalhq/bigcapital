import React from 'react';
import { Tab } from '@blueprintjs/core';
import { DrawerMainTabs } from 'components';
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
        title={'Invoice'}
        panel={<InvoicePaymentTransactionsTable />}
      />
      <Tab
        id={'estiamte'}
        title={'Estimate'}
        panel={<EstimatePaymentTransactionsTable />}
      />
      <Tab
        id={'receipt'}
        title={'Receipt'}
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

{
  /* <ItemSwitchMenuItem onChange={handleSwitch} /> */
}
