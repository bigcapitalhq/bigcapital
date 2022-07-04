import React from 'react';

import { Card } from '@/components';

import CashflowTransactionDrawerActionBar from './CashflowTransactionDrawerActionBar';
import CashflowTransactionDrawerHeader from './CashflowTransactionDrawerHeader';
import CashflowTransactionDrawerTable from './CashflowTransactionDrawerTable';
import CashflowTransactionDrawerFooter from './CashflowTransactionDrawerFooter';
/**
 * Cashflow transaction view details.
 */
export default function CashflowTransactionDrawerDetails() {
  return (
    <div className={'cashflow-drawer'}>
      <CashflowTransactionDrawerActionBar />

      <div className="cashflow-drawer__content">
        <Card>
          <CashflowTransactionDrawerHeader />
          <CashflowTransactionDrawerTable />
          <CashflowTransactionDrawerFooter />
        </Card>
      </div>
    </div>
  );
}
