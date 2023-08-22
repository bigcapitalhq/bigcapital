// @ts-nocheck
import React from 'react';

import { Card, CommercialDocBox } from '@/components';

import CashflowTransactionDrawerActionBar from './CashflowTransactionDrawerActionBar';
import CashflowTransactionDrawerHeader from './CashflowTransactionDrawerHeader';
import CashflowTransactionDrawerTable from './CashflowTransactionDrawerTable';
import CashflowTransactionDrawerTableFooter from './CashflowTransactionDrawerTableFooter';
import { CashflowTransactionDrawerFooter } from './CashflowTransactionDrawerFooter';
/**
 * Cashflow transaction view details.
 */
export default function CashflowTransactionDrawerDetails() {
  return (
    <div className={'cashflow-drawer'}>
      <CashflowTransactionDrawerActionBar />

      <div className="cashflow-drawer__content">
        <CommercialDocBox>
          <CashflowTransactionDrawerHeader />
          <CashflowTransactionDrawerTable />
          <CashflowTransactionDrawerTableFooter />
          <CashflowTransactionDrawerFooter />
        </CommercialDocBox>
      </div>
    </div>
  );
}
