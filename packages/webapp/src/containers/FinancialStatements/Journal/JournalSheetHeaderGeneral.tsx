import React from 'react';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { RadiosAccountingBasis } from '../RadiosAccountingBasis';

export function JournalSheetHeaderGeneralPanel() {
  return (
    <div>
      <FinancialStatementDateRange />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
