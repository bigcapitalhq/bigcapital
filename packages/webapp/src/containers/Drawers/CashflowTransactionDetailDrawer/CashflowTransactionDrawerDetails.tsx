// @ts-nocheck
import React from 'react';
import { CashflowTransactionDrawerActionBar } from './CashflowTransactionDrawerActionBar';
import { CashflowTransactionDrawerFooter } from './CashflowTransactionDrawerFooter';
import { CashflowTransactionDrawerHeader } from './CashflowTransactionDrawerHeader';
import { CashflowTransactionDrawerTable } from './CashflowTransactionDrawerTable';
import { CashflowTransactionDrawerTableFooter } from './CashflowTransactionDrawerTableFooter';
import { Card, CommercialDocBox } from '@/components';
/**
 * Cashflow transaction view details.
 */
export function CashflowTransactionDrawerDetails() {
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
